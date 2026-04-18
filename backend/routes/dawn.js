const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/dawn/today - Get today's check-in pool info
router.get('/today', async (req, res) => {
  try {
    const dayId = Math.floor(Date.now() / 86400000);
    
    const [[poolData]] = await pool.query(
      `SELECT 
        COUNT(*) as total_checkins,
        SUM(CASE WHEN is_on_time THEN 1 ELSE 0 END) as on_time_count,
        SUM(CASE WHEN NOT is_on_time THEN 1 ELSE 0 END) as late_count,
        COALESCE(SUM(deposit_amount), 0) as total_deposits,
        COALESCE(SUM(CASE WHEN NOT is_on_time THEN deposit_amount ELSE 0 END), 0) as late_pool
       FROM dawn_checkins WHERE day_id = ?`,
      [dayId]
    );
    
    // Check-in window: 5:00-8:00 UTC
    const now = new Date();
    const utcHour = now.getUTCHours();
    const isWindowOpen = utcHour >= 5 && utcHour < 8;
    
    res.json({
      success: true,
      data: {
        dayId,
        ...poolData,
        isWindowOpen,
        windowStart: '05:00 UTC',
        windowEnd: '08:00 UTC'
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/dawn/history/:wallet - User's check-in history
router.get('/history/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const { limit = 30 } = req.query;
    
    const [checkins] = await pool.query(
      `SELECT * FROM dawn_checkins 
       WHERE user_wallet = ? 
       ORDER BY day_id DESC LIMIT ?`,
      [wallet, parseInt(limit)]
    );
    
    // Calculate streak
    let streak = 0;
    const today = Math.floor(Date.now() / 86400000);
    for (let i = 0; i < checkins.length; i++) {
      if (checkins[i].day_id === today - i && checkins[i].is_on_time) {
        streak++;
      } else {
        break;
      }
    }
    
    res.json({
      success: true,
      data: { checkins, currentStreak: streak }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/dawn/leaderboard - Dawn early risers leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const [leaders] = await pool.query(
      `SELECT 
        dc.user_wallet as player,
        u.username,
        COUNT(*) as total_checkins,
        SUM(CASE WHEN dc.is_on_time THEN 1 ELSE 0 END) as on_time_count,
        COALESCE(SUM(dc.reward_amount), 0) as total_rewards,
        u.computing_power_bonus
       FROM dawn_checkins dc
       LEFT JOIN users u ON dc.user_wallet = u.wallet_address
       GROUP BY dc.user_wallet, u.username, u.computing_power_bonus
       ORDER BY total_rewards DESC
       LIMIT 50`
    );
    
    res.json({
      success: true,
      data: leaders.map((l, i) => ({ rank: i + 1, ...l }))
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
