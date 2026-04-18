const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/leaderboard/:period/:category
// period: daily, weekly, monthly, alltime
// category: profit, rooms, volume
router.get('/:period/:category', async (req, res) => {
  try {
    const { period, category } = req.params;
    const { limit = 50 } = req.query;
    
    const validPeriods = ['daily', 'weekly', 'monthly', 'alltime'];
    const validCategories = ['profit', 'rooms', 'volume'];
    
    if (!validPeriods.includes(period) || !validCategories.includes(category)) {
      return res.status(400).json({ success: false, error: 'Invalid period or category' });
    }
    
    let dateFilter = '';
    switch (period) {
      case 'daily':
        dateFilter = 'AND b.placed_at >= CURDATE()';
        break;
      case 'weekly':
        dateFilter = 'AND b.placed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        break;
      case 'monthly':
        dateFilter = 'AND b.placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        break;
      default:
        dateFilter = '';
    }
    
    let query;
    switch (category) {
      case 'profit':
        query = `
          SELECT 
            b.user_wallet as player,
            u.username,
            COUNT(DISTINCT CASE WHEN r.winning_team = b.team_index THEN r.id END) as wins,
            COUNT(DISTINCT CASE WHEN r.winning_team != b.team_index AND r.status='settled' THEN r.id END) as losses,
            SUM(b.amount) as total_bets,
            ROUND(COUNT(DISTINCT CASE WHEN r.winning_team = b.team_index THEN r.id END) * 100.0 / 
              NULLIF(COUNT(DISTINCT CASE WHEN r.status='settled' THEN r.id END), 0), 1) as win_rate,
            COALESCE(SUM(rw.profit), 0) as profit_loss
          FROM bets b
          JOIN rooms r ON b.room_id = r.id
          LEFT JOIN users u ON b.user_wallet = u.wallet_address
          LEFT JOIN rewards rw ON rw.room_id = r.id AND rw.user_wallet = b.user_wallet
          WHERE r.status = 'settled' ${dateFilter}
          GROUP BY b.user_wallet, u.username
          ORDER BY profit_loss DESC
          LIMIT ?`;
        break;
        
      case 'rooms': {
        const roomsDateFilter = period === 'alltime' ? '' :
          period === 'daily'   ? 'AND r.settled_at >= CURDATE()' :
          period === 'weekly'  ? 'AND r.settled_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)' :
                                 'AND r.settled_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        query = `
          SELECT
            r.room_name as game_name,
            r.total_participants,
            (SELECT COUNT(*) FROM rewards rw WHERE rw.room_id = r.id) as winner_count,
            r.total_prize_pool,
            r.settled_at
          FROM rooms r
          WHERE r.status = 'settled' ${roomsDateFilter}
          ORDER BY r.total_prize_pool DESC
          LIMIT ?`;
        break;
      }
      case 'volume':
        query = `
          SELECT
            b.user_wallet as player,
            u.username,
            COUNT(DISTINCT r.id) as game_count,
            MAX(b.amount) as max_single_bet,
            SUM(b.amount) as total_volume
          FROM bets b
          JOIN rooms r ON b.room_id = r.id
          LEFT JOIN users u ON b.user_wallet = u.wallet_address
          WHERE 1=1 ${dateFilter}
          GROUP BY b.user_wallet, u.username
          ORDER BY total_volume DESC
          LIMIT ?`;
        break;
    }
    
    const [rows] = await pool.query(query, [parseInt(limit)]);
    
    res.json({
      success: true,
      data: rows.map((row, i) => ({ rank: i + 1, ...row })),
      period,
      category
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
