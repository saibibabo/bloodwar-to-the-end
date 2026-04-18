/**
 * Chain Sync Service
 * Listens to on-chain events from Factory and Room contracts
 * and synchronizes data to the database.
 */
const { ethers } = require('ethers');
const { pool } = require('../config/database');
const { FACTORY_ABI, ROOM_ABI, FACTORY_ADDRESS, BSC_RPC_URL, BSC_WS_URL } = require('../config/contracts');
require('dotenv').config();

class ChainSyncService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    this.factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.provider);
    this.trackedRooms = new Map();
    this.syncInterval = parseInt(process.env.SYNC_INTERVAL_MS) || 5000;
  }

  async start() {
    console.log('[ChainSync] Starting blockchain event listener...');
    
    // Listen for new rooms
    this.factoryContract.on('RoomCreated', async (roomId, roomAddress, creator, roomName, maxTeams, duration, initialBetLimit, event) => {
      console.log(`[ChainSync] New room created: ${roomId} at ${roomAddress}`);
      
      try {
        await pool.query(
          `INSERT INTO rooms (room_id_onchain, contract_address, creator_wallet, room_name, max_teams, 
           bet_token_address, initial_bet_limit, current_bet_limit, duration_seconds)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE room_name = VALUES(room_name)`,
          [
            roomId.toString(),
            roomAddress.toLowerCase(),
            creator.toLowerCase(),
            roomName,
            maxTeams,
            process.env.BET_TOKEN_ADDRESS,
            ethers.formatEther(initialBetLimit),
            ethers.formatEther(initialBetLimit),
            duration.toString()
          ]
        );
        
        // Initialize teams
        for (let i = 0; i < maxTeams; i++) {
          await pool.query(
            `INSERT IGNORE INTO room_teams (room_id, team_index, team_name) 
             VALUES ((SELECT id FROM rooms WHERE room_id_onchain = ?), ?, ?)`,
            [roomId.toString(), i, `Team ${String.fromCharCode(65 + i)}`]
          );
        }
        
        // Start tracking this room
        this.trackRoom(roomAddress, roomId.toString());
      } catch (err) {
        console.error('[ChainSync] Error saving room:', err);
      }
    });
    
    // Load existing active rooms
    const [activeRooms] = await pool.query(
      "SELECT room_id_onchain, contract_address FROM rooms WHERE status IN ('waiting', 'active')"
    );
    
    for (const room of activeRooms) {
      this.trackRoom(room.contract_address, room.room_id_onchain.toString());
    }
    
    console.log(`[ChainSync] Tracking ${activeRooms.length} active rooms`);
  }

  trackRoom(roomAddress, roomId) {
    if (this.trackedRooms.has(roomAddress)) return;
    
    const roomContract = new ethers.Contract(roomAddress, ROOM_ABI, this.provider);
    this.trackedRooms.set(roomAddress, roomContract);
    
    // Listen for bets
    roomContract.on('BetPlaced', async (user, team, amount, event) => {
      console.log(`[ChainSync] Bet placed in room ${roomId}: ${user} -> Team ${team}, ${ethers.formatEther(amount)} U`);
      
      try {
        const [roomRows] = await pool.query('SELECT id FROM rooms WHERE room_id_onchain = ?', [roomId]);
        if (roomRows.length === 0) return;
        const dbRoomId = roomRows[0].id;
        
        await pool.query(
          `INSERT INTO bets (room_id, user_wallet, team_index, amount, tx_hash, block_number)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [dbRoomId, user.toLowerCase(), team, ethers.formatEther(amount), event.log.transactionHash, event.log.blockNumber]
        );
        
        // Update team totals
        await pool.query(
          `UPDATE room_teams SET total_bets = total_bets + ?, supporter_count = supporter_count + 1
           WHERE room_id = ? AND team_index = ?`,
          [ethers.formatEther(amount), dbRoomId, team]
        );
        
        // Ensure user exists
        await pool.query(
          `INSERT IGNORE INTO users (wallet_address, invite_code) VALUES (?, ?)`,
          [user.toLowerCase(), Math.random().toString(36).slice(2, 10).toUpperCase()]
        );
        
        // Update room participant count
        await pool.query(
          `UPDATE rooms SET total_participants = (SELECT COUNT(DISTINCT user_wallet) FROM bets WHERE room_id = ?)
           WHERE id = ?`,
          [dbRoomId, dbRoomId]
        );
      } catch (err) {
        console.error('[ChainSync] Error saving bet:', err);
      }
    });
    
    // Listen for match start
    roomContract.on('MatchStarted', async (startTime, endTime) => {
      console.log(`[ChainSync] Match started in room ${roomId}`);
      try {
        await pool.query(
          `UPDATE rooms SET status = 'active', start_time = FROM_UNIXTIME(?), end_time = FROM_UNIXTIME(?)
           WHERE room_id_onchain = ?`,
          [startTime.toString(), endTime.toString(), roomId]
        );
      } catch (err) {
        console.error('[ChainSync] Error updating match start:', err);
      }
    });
    
    // Listen for settlement
    roomContract.on('MatchSettled', async (winningTeam, prizePool, fees) => {
      console.log(`[ChainSync] Match settled in room ${roomId}: Team ${winningTeam} wins`);
      try {
        await pool.query(
          `UPDATE rooms SET status = 'settled', winning_team = ?, total_prize_pool = ?, 
           total_fees = ?, settled_at = NOW()
           WHERE room_id_onchain = ?`,
          [winningTeam, ethers.formatEther(prizePool), ethers.formatEther(fees), roomId]
        );
        
        await pool.query(
          `UPDATE room_teams SET is_winner = TRUE 
           WHERE room_id = (SELECT id FROM rooms WHERE room_id_onchain = ?) AND team_index = ?`,
          [roomId, winningTeam]
        );
        
        // Record fees
        const [roomRows] = await pool.query('SELECT id FROM rooms WHERE room_id_onchain = ?', [roomId]);
        if (roomRows.length > 0) {
          const feesEth = ethers.formatEther(fees);
          const creatorReward = parseFloat(feesEth) * 0.01;
          await pool.query(
            `INSERT INTO platform_fees (room_id, fee_amount, creator_reward, platform_amount)
             VALUES (?, ?, ?, ?)`,
            [roomRows[0].id, feesEth, creatorReward, parseFloat(feesEth) - creatorReward]
          );
        }
        
        // Stop tracking settled room
        roomContract.removeAllListeners();
        this.trackedRooms.delete(roomAddress);
      } catch (err) {
        console.error('[ChainSync] Error settling match:', err);
      }
    });
    
    // Listen for reward claims
    roomContract.on('RewardClaimed', async (user, amount, event) => {
      console.log(`[ChainSync] Reward claimed in room ${roomId}: ${user} -> ${ethers.formatEther(amount)} U`);
      try {
        const [roomRows] = await pool.query('SELECT id, winning_team FROM rooms WHERE room_id_onchain = ?', [roomId]);
        if (roomRows.length === 0) return;
        
        const [betRows] = await pool.query(
          'SELECT amount FROM bets WHERE room_id = ? AND user_wallet = ?',
          [roomRows[0].id, user.toLowerCase()]
        );
        
        const betAmount = betRows.reduce((sum, b) => sum + parseFloat(b.amount), 0);
        const rewardAmount = parseFloat(ethers.formatEther(amount));
        
        await pool.query(
          `INSERT INTO rewards (room_id, user_wallet, reward_amount, bet_amount, profit, contribution_degree, tx_hash)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            roomRows[0].id,
            user.toLowerCase(),
            rewardAmount,
            betAmount,
            rewardAmount - betAmount,
            betAmount > 0 ? betAmount / rewardAmount : 0,
            event.log.transactionHash
          ]
        );
        
        // Update user stats
        await pool.query(
          `UPDATE users SET total_wins = total_wins + 1, total_profit = total_profit + ?
           WHERE wallet_address = ?`,
          [rewardAmount - betAmount, user.toLowerCase()]
        );
      } catch (err) {
        console.error('[ChainSync] Error saving reward:', err);
      }
    });
    
    // Listen for cancellation
    roomContract.on('MatchCancelled', async () => {
      console.log(`[ChainSync] Match cancelled in room ${roomId}`);
      try {
        await pool.query("UPDATE rooms SET status = 'cancelled' WHERE room_id_onchain = ?", [roomId]);
        roomContract.removeAllListeners();
        this.trackedRooms.delete(roomAddress);
      } catch (err) {
        console.error('[ChainSync] Error cancelling match:', err);
      }
    });
  }

  stop() {
    this.factoryContract.removeAllListeners();
    this.trackedRooms.forEach(contract => contract.removeAllListeners());
    this.trackedRooms.clear();
    console.log('[ChainSync] Stopped.');
  }
}

module.exports = ChainSyncService;
