const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/users/:wallet - Get user profile
router.get('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    let [users] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [wallet]);
    
    if (users.length === 0) {
      // Auto-create user on first visit
      const inviteCode = uuidv4().slice(0, 8).toUpperCase();
      await pool.query(
        'INSERT INTO users (wallet_address, invite_code) VALUES (?, ?)',
        [wallet, inviteCode]
      );
      [users] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [wallet]);
    }
    
    const user = users[0];
    
    // Get recent matches
    const [recentMatches] = await pool.query(
      `SELECT r.room_name, r.status, r.winning_team, b.team_index, b.amount, 
              rw.reward_amount, rw.profit
       FROM bets b 
       JOIN rooms r ON b.room_id = r.id
       LEFT JOIN rewards rw ON rw.room_id = r.id AND rw.user_wallet = b.user_wallet
       WHERE b.user_wallet = ?
       ORDER BY b.placed_at DESC LIMIT 20`,
      [wallet]
    );
    
    res.json({ success: true, data: { ...user, recentMatches } });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/users/:wallet - Update profile
router.put('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const { username, language, currency_unit, avatar } = req.body;

    if (username) {
      // Check uniqueness
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE username = ? AND wallet_address != ?',
        [username, wallet]
      );
      if (existing.length > 0) {
        return res.status(409).json({ success: false, error: 'Username taken' });
      }
    }
    
    const updates = [];
    const params = [];
    if (username) { updates.push('username = ?'); params.push(username); }
    if (language) { updates.push('language = ?'); params.push(language); }
    if (currency_unit) { updates.push('currency_unit = ?'); params.push(currency_unit); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    params.push(wallet);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE wallet_address = ?`, params);
    
    const [updated] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [wallet]);
    res.json({ success: true, data: updated[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/users/:wallet/invite - Apply invite code
router.post('/:wallet/invite', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const { inviteCode } = req.body;
    
    const [inviter] = await pool.query('SELECT * FROM users WHERE invite_code = ?', [inviteCode]);
    if (inviter.length === 0) {
      return res.status(404).json({ success: false, error: 'Invalid invite code' });
    }
    
    if (inviter[0].wallet_address === wallet) {
      return res.status(400).json({ success: false, error: 'Cannot invite yourself' });
    }
    
    // Check if already invited
    const [existing] = await pool.query('SELECT id FROM invitations WHERE invitee_wallet = ?', [wallet]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Already invited' });
    }
    
    await pool.query(
      'INSERT INTO invitations (inviter_wallet, invitee_wallet, invite_code) VALUES (?, ?, ?)',
      [inviter[0].wallet_address, wallet, inviteCode]
    );
    
    await pool.query('UPDATE users SET invited_by = ? WHERE wallet_address = ?', [inviter[0].id, wallet]);
    
    // Update computing power bonus
    await pool.query(
      'UPDATE users SET computing_power_bonus = LEAST(computing_power_bonus + 0.05, 1.0) WHERE wallet_address = ?',
      [inviter[0].wallet_address]
    );
    
    res.json({ success: true, message: 'Invite applied successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/users/:wallet/follow/:target - Toggle follow
router.post('/:wallet/follow/:target', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const target = req.params.target.toLowerCase();
    if (wallet === target) return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    const [existing] = await pool.query(
      'SELECT 1 FROM user_follows WHERE follower_wallet=? AND following_wallet=?', [wallet, target]
    );
    if (existing.length > 0) {
      await pool.query('DELETE FROM user_follows WHERE follower_wallet=? AND following_wallet=?', [wallet, target]);
      return res.json({ success: true, following: false });
    } else {
      await pool.query('INSERT INTO user_follows (follower_wallet, following_wallet) VALUES (?,?)', [wallet, target]);
      return res.json({ success: true, following: true });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:wallet/social?viewer= - Get social stats (followers, noted count, is_following)
router.get('/:wallet/social', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const viewer = req.query.viewer ? req.query.viewer.toLowerCase() : null;
    const [[{ follower_count }]] = await pool.query(
      'SELECT COUNT(*) as follower_count FROM user_follows WHERE following_wallet=?', [wallet]
    );
    const [[{ noted_count }]] = await pool.query(
      'SELECT COUNT(*) as noted_count FROM user_notes WHERE noted_wallet=?', [wallet]
    );
    let is_following = false;
    if (viewer && viewer !== wallet) {
      const [rows] = await pool.query(
        'SELECT 1 FROM user_follows WHERE follower_wallet=? AND following_wallet=?', [viewer, wallet]
      );
      is_following = rows.length > 0;
    }
    res.json({ success: true, data: { follower_count, noted_count, is_following } });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:wallet/note/:target - Get private note (noter = wallet, about target)
router.get('/:wallet/note/:target', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const target = req.params.target.toLowerCase();
    const [rows] = await pool.query(
      'SELECT note_text FROM user_notes WHERE noter_wallet=? AND noted_wallet=?', [wallet, target]
    );
    res.json({ success: true, note: rows.length > 0 ? rows[0].note_text : '' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/users/:wallet/note/:target - Save private note
router.put('/:wallet/note/:target', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const target = req.params.target.toLowerCase();
    const { note } = req.body;
    await pool.query(
      'INSERT INTO user_notes (noter_wallet, noted_wallet, note_text) VALUES (?,?,?) ON DUPLICATE KEY UPDATE note_text=?, updated_at=NOW()',
      [wallet, target, note || '', note || '']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:wallet/stats - Detailed stats
router.get('/:wallet/stats', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    
    const [[stats]] = await pool.query(
      `SELECT 
        COUNT(*) as total_matches,
        SUM(CASE WHEN r.winning_team = b.team_index THEN 1 ELSE 0 END) as wins,
        SUM(b.amount) as total_wagered,
        COALESCE(SUM(rw.profit), 0) as total_profit
       FROM bets b
       JOIN rooms r ON b.room_id = r.id
       LEFT JOIN rewards rw ON rw.room_id = r.id AND rw.user_wallet = b.user_wallet
       WHERE b.user_wallet = ? AND r.status = 'settled'`,
      [wallet]
    );
    
    const [[checkins]] = await pool.query(
      `SELECT COUNT(*) as total_checkins, 
              SUM(CASE WHEN is_on_time THEN 1 ELSE 0 END) as on_time_checkins,
              COALESCE(SUM(reward_amount), 0) as total_dawn_rewards
       FROM dawn_checkins WHERE user_wallet = ?`,
      [wallet]
    );
    
    res.json({ success: true, data: { ...stats, ...checkins } });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
