const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/rooms - List all rooms with filters
router.get('/', async (req, res) => {
  try {
    const { status, creator, page = 1, limit = 20, sort = 'created_at' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM rooms WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (creator) {
      query += ' AND creator_wallet = ?';
      params.push(creator.toLowerCase());
    }
    
    const validSorts = ['created_at', 'total_prize_pool', 'total_participants'];
    const sortCol = validSorts.includes(sort) ? sort : 'created_at';
    query += ` ORDER BY ${sortCol} DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM rooms WHERE 1=1');
    
    res.json({
      success: true,
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/rooms/:id - Get room details (by room_id_onchain or DB id)
router.get('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    const [rooms] = await pool.query(
      'SELECT * FROM rooms WHERE room_id_onchain = ? OR id = ?',
      [idParam, idParam]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }
    
    const room = rooms[0];
    
    // Get teams
    const [teams] = await pool.query(
      'SELECT * FROM room_teams WHERE room_id = ? ORDER BY team_index',
      [room.id]
    );
    
    // Get recent bets
    const [recentBets] = await pool.query(
      'SELECT b.*, u.username FROM bets b LEFT JOIN users u ON b.user_wallet = u.wallet_address WHERE b.room_id = ? ORDER BY b.placed_at DESC LIMIT 50',
      [room.id]
    );
    
    res.json({
      success: true,
      data: { ...room, teams, recentBets }
    });
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/rooms/:id/bets - Get all bets for a room
router.get('/:id/bets', async (req, res) => {
  try {
    const [bets] = await pool.query(
      `SELECT b.*, u.username 
       FROM bets b 
       LEFT JOIN users u ON b.user_wallet = u.wallet_address 
       WHERE b.room_id = (SELECT id FROM rooms WHERE room_id_onchain = ?)
       ORDER BY b.placed_at DESC`,
      [req.params.id]
    );
    
    res.json({ success: true, data: bets });
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/rooms - Create room (demo / off-chain mode)
router.post('/', async (req, res) => {
  try {
    const {
      room_name, max_teams = 2, duration_seconds = 1800,
      initial_bet_limit = 100, creator_wallet,
      bet_token_address = '0x0000000000000000000000000000000000000000',
      first_team_name, bet_limit_step_pct = 50,
    } = req.body;

    if (!room_name || !creator_wallet) {
      return res.status(400).json({ success: false, error: 'room_name and creator_wallet required' });
    }
    const stepPct = Math.min(100, Math.max(20, parseInt(bet_limit_step_pct) || 50));

    // Room starts in 'waiting' — timer begins when first non-creator joins
    const [result] = await pool.query(
      `INSERT INTO rooms
        (room_name, max_teams, status, creator_wallet, bet_token_address,
         initial_bet_limit, current_bet_limit, bet_limit_step_pct, duration_seconds)
       VALUES (?, ?, 'waiting', ?, ?, ?, ?, ?, ?)`,
      [room_name, max_teams, creator_wallet.toLowerCase(), bet_token_address,
       initial_bet_limit, initial_bet_limit, stepPct, duration_seconds]
    );

    const roomId = result.insertId;
    const creatorLC = creator_wallet.toLowerCase();

    // Create team rows — first team gets creator's chosen name
    const teamInserts = Array.from({ length: max_teams }, (_, i) => {
      const name = i === 0 && first_team_name ? first_team_name : null;
      const nameSetBy = i === 0 && first_team_name ? creatorLC : null;
      return pool.query(
        'INSERT INTO room_teams (room_id, team_index, team_name, name_set_by) VALUES (?, ?, ?, ?)',
        [roomId, i, name, nameSetBy]
      );
    });
    await Promise.all(teamInserts);

    const [[room]] = await pool.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    res.status(201).json({ success: true, data: room });
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/rooms/:id/start - Start timer when first non-creator joins
router.post('/:id/start', async (req, res) => {
  try {
    const { joiner_wallet } = req.body;
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rooms.length === 0) return res.status(404).json({ success: false, error: 'Room not found' });

    const room = rooms[0];
    if (room.status !== 'waiting') return res.json({ success: true, data: room });
    if (!joiner_wallet || room.creator_wallet === joiner_wallet.toLowerCase()) {
      return res.json({ success: true, data: room });
    }

    const endTime = new Date(Date.now() + room.duration_seconds * 1000);
    await pool.query(
      `UPDATE rooms SET status = 'active', start_time = NOW(), end_time = ? WHERE id = ?`,
      [endTime, room.id]
    );

    const [[updated]] = await pool.query('SELECT * FROM rooms WHERE id = ?', [room.id]);
    res.json({ success: true, data: updated, started: true });
  } catch (err) {
    console.error('Error starting room:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/rooms/:id/teams/:teamIdx/name - Update team name
router.put('/:id/teams/:teamIdx/name', async (req, res) => {
  try {
    const { team_name, wallet } = req.body;
    if (!team_name || !wallet) return res.status(400).json({ success: false, error: 'team_name and wallet required' });

    const [rooms] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rooms.length === 0) return res.status(404).json({ success: false, error: 'Room not found' });
    const room = rooms[0];

    const teamIdx = parseInt(req.params.teamIdx);
    const [teams] = await pool.query(
      'SELECT * FROM room_teams WHERE room_id = ? AND team_index = ?', [room.id, teamIdx]
    );
    if (teams.length === 0) return res.status(404).json({ success: false, error: 'Team not found' });
    const team = teams[0];

    const walletLC = wallet.toLowerCase();
    // Allow only if: no one set it yet, OR the same wallet is updating their own name
    if (team.name_set_by && team.name_set_by !== walletLC) {
      return res.status(403).json({ success: false, error: 'Team name already set by another player' });
    }

    await pool.query(
      'UPDATE room_teams SET team_name = ?, name_set_by = ? WHERE room_id = ? AND team_index = ?',
      [team_name.trim(), walletLC, room.id, teamIdx]
    );
    res.json({ success: true, data: { team_name: team_name.trim(), name_set_by: walletLC } });
  } catch (err) {
    console.error('Error updating team name:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/rooms/active - Get currently active rooms
router.get('/status/active', async (req, res) => {
  try {
    const [rooms] = await pool.query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM bets WHERE room_id = r.id) as bet_count
       FROM rooms r 
       WHERE r.status = 'active' 
       ORDER BY r.total_participants DESC 
       LIMIT 50`
    );
    
    res.json({ success: true, data: rooms });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
