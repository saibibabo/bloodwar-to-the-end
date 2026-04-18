const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/stats - Platform-wide statistics
router.get('/', async (req, res) => {
  try {
    const [[roomStats]] = await pool.query(
      `SELECT 
        COUNT(*) as total_rooms,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active_rooms,
        SUM(CASE WHEN status='settled' THEN 1 ELSE 0 END) as settled_rooms,
        COALESCE(SUM(total_prize_pool), 0) as total_volume,
        COALESCE(SUM(total_fees), 0) as total_fees_collected
       FROM rooms`
    );
    
    const [[userStats]] = await pool.query(
      `SELECT COUNT(DISTINCT wallet_address) as total_users FROM users`
    );
    
    const [[betStats]] = await pool.query(
      `SELECT 
        COUNT(*) as total_bets,
        COALESCE(SUM(amount), 0) as total_wagered
       FROM bets`
    );
    
    const [[todayStats]] = await pool.query(
      `SELECT 
        COUNT(DISTINCT r.id) as rooms_today,
        COUNT(DISTINCT b.user_wallet) as active_users_today
       FROM rooms r
       LEFT JOIN bets b ON b.room_id = r.id AND b.placed_at >= CURDATE()
       WHERE r.created_at >= CURDATE()`
    );
    
    res.json({
      success: true,
      data: {
        ...roomStats,
        ...userStats,
        ...betStats,
        ...todayStats
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
