/**
 * Chain Sync Service
 * Listens to BSC on-chain events and syncs to database.
 * Run alongside the API server: node scripts/sync-chain.js
 */
const { ethers } = require('ethers');
const { pool } = require('../config/database');
const { FACTORY_ABI, ROOM_ABI, FACTORY_ADDRESS, BSC_RPC_URL, BSC_WS_URL } = require('../config/contracts');
require('dotenv').config();

let provider;

async function initProvider() {
  try {
    if (BSC_WS_URL) {
      provider = new ethers.WebSocketProvider(BSC_WS_URL);
    } else {
      provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    }
    console.log('Connected to BSC network');
    return provider;
  } catch (err) {
    console.error('Failed to connect:', err);
    // Fallback to HTTP
    provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    return provider;
  }
}

async function getLastSyncBlock(contractAddress, eventName) {
  const [[row]] = await pool.query(
    'SELECT last_block FROM sync_state WHERE contract_address = ? AND event_name = ?',
    [contractAddress, eventName]
  );
  return row ? row.last_block : parseInt(process.env.SYNC_START_BLOCK || '0');
}

async function updateSyncBlock(contractAddress, eventName, blockNumber) {
  await pool.query(
    `INSERT INTO sync_state (contract_address, event_name, last_block) 
     VALUES (?, ?, ?) 
     ON DUPLICATE KEY UPDATE last_block = ?, updated_at = NOW()`,
    [contractAddress, eventName, blockNumber, blockNumber]
  );
}

async function syncFactoryEvents() {
  if (!FACTORY_ADDRESS || FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
    console.log('Factory address not configured, skipping sync');
    return;
  }

  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
  const lastBlock = await getLastSyncBlock(FACTORY_ADDRESS, 'RoomCreated');
  const currentBlock = await provider.getBlockNumber();

  if (lastBlock >= currentBlock) return;

  console.log(`Syncing factory events from block ${lastBlock} to ${currentBlock}`);

  const batchSize = 5000;
  for (let from = lastBlock + 1; from <= currentBlock; from += batchSize) {
    const to = Math.min(from + batchSize - 1, currentBlock);

    try {
      const events = await factory.queryFilter('RoomCreated', from, to);

      for (const event of events) {
        const { roomId, roomAddress, creator, roomName, maxTeams, duration, initialBetLimit } = event.args;

        await pool.query(
          `INSERT IGNORE INTO rooms 
           (room_id_onchain, contract_address, creator_wallet, room_name, max_teams, 
            bet_token_address, initial_bet_limit, current_bet_limit, duration_seconds)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            Number(roomId),
            roomAddress.toLowerCase(),
            creator.toLowerCase(),
            roomName,
            Number(maxTeams),
            process.env.BET_TOKEN_ADDRESS,
            ethers.formatEther(initialBetLimit),
            ethers.formatEther(initialBetLimit),
            Number(duration)
          ]
        );

        // Create team entries
        for (let t = 0; t < Number(maxTeams); t++) {
          await pool.query(
            'INSERT IGNORE INTO room_teams (room_id, team_index, team_name) VALUES ((SELECT id FROM rooms WHERE room_id_onchain = ?), ?, ?)',
            [Number(roomId), t, `Team ${String.fromCharCode(65 + t)}`]
          );
        }

        // Auto-create user if needed
        await pool.query(
          'INSERT IGNORE INTO users (wallet_address, invite_code) VALUES (?, ?)',
          [creator.toLowerCase(), Math.random().toString(36).substring(2, 10).toUpperCase()]
        );

        console.log(`Room created: #${roomId} at ${roomAddress}`);

        // Start listening to room events
        syncRoomEvents(roomAddress.toLowerCase());
      }
    } catch (err) {
      console.error(`Error syncing blocks ${from}-${to}:`, err.message);
    }
  }

  await updateSyncBlock(FACTORY_ADDRESS, 'RoomCreated', currentBlock);
}

async function syncRoomEvents(roomAddress) {
  try {
    const room = new ethers.Contract(roomAddress, ROOM_ABI, provider);
    const lastBlock = await getLastSyncBlock(roomAddress, 'BetPlaced');
    const currentBlock = await provider.getBlockNumber();

    if (lastBlock >= currentBlock) return;

    // Sync BetPlaced events
    const betEvents = await room.queryFilter('BetPlaced', lastBlock + 1, currentBlock);
    for (const event of betEvents) {
      const { user, team, amount } = event.args;
      const tx = event.transactionHash;

      const [roomRow] = await pool.query('SELECT id FROM rooms WHERE contract_address = ?', [roomAddress]);
      if (roomRow.length === 0) continue;

      await pool.query(
        `INSERT IGNORE INTO bets (room_id, user_wallet, team_index, amount, tx_hash, block_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [roomRow[0].id, user.toLowerCase(), Number(team), ethers.formatEther(amount), tx, event.blockNumber]
      );

      // Update team totals
      await pool.query(
        `UPDATE room_teams SET total_bets = total_bets + ?, supporter_count = supporter_count + 1
         WHERE room_id = ? AND team_index = ?`,
        [ethers.formatEther(amount), roomRow[0].id, Number(team)]
      );

      // Update room participant count
      await pool.query(
        'UPDATE rooms SET total_participants = (SELECT COUNT(DISTINCT user_wallet) FROM bets WHERE room_id = ?) WHERE id = ?',
        [roomRow[0].id, roomRow[0].id]
      );

      // Broadcast via WebSocket
      if (global.wsBroadcast) {
        global.wsBroadcast('bet_placed', {
          user: user.toLowerCase(),
          team: Number(team),
          amount: ethers.formatEther(amount)
        }, roomAddress);
      }
    }

    // Sync MatchSettled events
    const settleEvents = await room.queryFilter('MatchSettled', lastBlock + 1, currentBlock);
    for (const event of settleEvents) {
      const { winningTeam, prizePool, fees } = event.args;

      await pool.query(
        `UPDATE rooms SET status = 'settled', winning_team = ?, total_prize_pool = ?, 
         total_fees = ?, settled_at = NOW() WHERE contract_address = ?`,
        [Number(winningTeam), ethers.formatEther(prizePool), ethers.formatEther(fees), roomAddress]
      );

      await pool.query(
        'UPDATE room_teams SET is_winner = TRUE WHERE room_id = (SELECT id FROM rooms WHERE contract_address = ?) AND team_index = ?',
        [roomAddress, Number(winningTeam)]
      );

      if (global.wsBroadcast) {
        global.wsBroadcast('match_settled', {
          winningTeam: Number(winningTeam),
          prizePool: ethers.formatEther(prizePool)
        }, roomAddress);
      }
    }

    // Sync MatchStarted events
    const startEvents = await room.queryFilter('MatchStarted', lastBlock + 1, currentBlock);
    for (const event of startEvents) {
      const { startTime, endTime } = event.args;
      await pool.query(
        `UPDATE rooms SET status = 'active', start_time = FROM_UNIXTIME(?), end_time = FROM_UNIXTIME(?)
         WHERE contract_address = ?`,
        [Number(startTime), Number(endTime), roomAddress]
      );
    }

    // Sync RewardClaimed events
    const claimEvents = await room.queryFilter('RewardClaimed', lastBlock + 1, currentBlock);
    for (const event of claimEvents) {
      const { user, amount } = event.args;
      const [roomRow] = await pool.query('SELECT id FROM rooms WHERE contract_address = ?', [roomAddress]);
      if (roomRow.length === 0) continue;

      const [betRow] = await pool.query(
        'SELECT amount, team_index FROM bets WHERE room_id = ? AND user_wallet = ? LIMIT 1',
        [roomRow[0].id, user.toLowerCase()]
      );

      const rewardAmount = parseFloat(ethers.formatEther(amount));
      const betAmount = betRow.length > 0 ? parseFloat(betRow[0].amount) : 0;

      await pool.query(
        `INSERT IGNORE INTO rewards (room_id, user_wallet, reward_amount, bet_amount, profit, contribution_degree, tx_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          roomRow[0].id,
          user.toLowerCase(),
          rewardAmount,
          betAmount,
          rewardAmount - betAmount,
          betAmount > 0 ? betAmount / rewardAmount : 0,
          event.transactionHash
        ]
      );

      // Update user stats
      await pool.query(
        `UPDATE users SET total_wins = total_wins + 1, total_profit = total_profit + ?
         WHERE wallet_address = ?`,
        [rewardAmount - betAmount, user.toLowerCase()]
      );
    }

    await updateSyncBlock(roomAddress, 'BetPlaced', currentBlock);

  } catch (err) {
    console.error(`Error syncing room ${roomAddress}:`, err.message);
  }
}

// Main sync loop
async function startSync() {
  await initProvider();

  console.log('Starting blockchain sync service...');

  // Initial sync
  await syncFactoryEvents();

  // Sync all known rooms
  const [rooms] = await pool.query('SELECT contract_address FROM rooms WHERE status IN ("waiting", "active")');
  for (const room of rooms) {
    await syncRoomEvents(room.contract_address);
  }

  // Continuous polling
  const interval = parseInt(process.env.SYNC_INTERVAL_MS || '5000');
  setInterval(async () => {
    try {
      await syncFactoryEvents();
      const [activeRooms] = await pool.query('SELECT contract_address FROM rooms WHERE status IN ("waiting", "active")');
      for (const room of activeRooms) {
        await syncRoomEvents(room.contract_address);
      }
    } catch (err) {
      console.error('Sync cycle error:', err.message);
    }
  }, interval);
}

startSync().catch(console.error);

module.exports = { syncFactoryEvents, syncRoomEvents };
