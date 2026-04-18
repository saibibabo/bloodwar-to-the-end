require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const dawnRoutes = require('./routes/dawn');
const statsRoutes = require('./routes/stats');
const ChainSyncService = require('./utils/chain-sync');

const app = express();
const server = http.createServer(app);

// ========================
// Middleware
// ========================
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true }));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true, legacyHeaders: false,
});
app.use('/api/', limiter);

// ========================
// Static Files (Frontend)
// ========================
app.use(express.static(path.join(__dirname, '../frontend')));

// ========================
// API Routes
// ========================
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/dawn', dawnRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '1.0.0' });
});

app.get('/api/config', (req, res) => {
  res.json({
    factoryAddress: process.env.FACTORY_CONTRACT_ADDRESS,
    dawnAddress: process.env.DAWN_CONTRACT_ADDRESS,
    betTokenAddress: process.env.BET_TOKEN_ADDRESS,
    chainId: parseInt(process.env.BSC_CHAIN_ID || '56'),
    rpcUrl: process.env.BSC_RPC_URL,
    platformFeePercent: 5,
    wsUrl: `ws://${req.headers.host}/ws`
  });
});

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ========================
// WebSocket Server
// ========================
const wss = new WebSocketServer({ server, path: '/ws' });
const roomSubscriptions = new Map();

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.subscribedRooms = new Set();

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'subscribe_room') {
        ws.subscribedRooms.add(msg.roomId);
        if (!roomSubscriptions.has(msg.roomId)) roomSubscriptions.set(msg.roomId, new Set());
        roomSubscriptions.get(msg.roomId).add(ws);
      } else if (msg.type === 'unsubscribe_room') {
        ws.subscribedRooms.delete(msg.roomId);
        roomSubscriptions.get(msg.roomId)?.delete(ws);
      } else if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (e) { /* ignore bad messages */ }
  });

  ws.on('close', () => {
    ws.subscribedRooms.forEach(roomId => {
      roomSubscriptions.get(roomId)?.delete(ws);
    });
  });
});

// Heartbeat
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Broadcast helper (used by chain-sync)
function broadcastToRoom(roomId, message) {
  const subs = roomSubscriptions.get(roomId);
  if (!subs) return;
  const payload = JSON.stringify(message);
  subs.forEach(ws => { if (ws.readyState === 1) ws.send(payload); });
}

function broadcastAll(message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach(ws => { if (ws.readyState === 1) ws.send(payload); });
}

global.broadcastToRoom = broadcastToRoom;
global.broadcastAll = broadcastAll;

// ========================
// Start
// ========================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🔥 Blood War to the End - Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}\n`);
});

// Start chain sync if configured
if (process.env.FACTORY_CONTRACT_ADDRESS && process.env.FACTORY_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
  const syncService = new ChainSyncService();
  syncService.start().catch(err => console.error('[ChainSync] Failed to start:', err.message));
}

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
