# Blood War to the End

> Decentralized PK Competition Platform on Binance Smart Chain (FomoPlayground Sub-platform)

## Architecture

```
bloodwar/
├── contracts/           # Solidity smart contracts
│   ├── PkRoomFactory.sol    # Factory: deploys independent match rooms
│   ├── PkRoom.sol           # Match room: betting, settlement, rewards
│   ├── DawnProtocol.sol     # Daily check-in staking protocol
│   └── IERC20.sol           # ERC20 interface
├── backend/             # Node.js + Express API server
│   ├── server.js            # Main server with WebSocket
│   ├── config/              # Database & contract config
│   ├── routes/              # REST API endpoints
│   └── utils/               # Chain sync service
├── frontend/            # Vanilla HTML/CSS/JS SPA
│   ├── index.html           # Single-page application
│   ├── css/main.css         # Gaming aesthetic styling
│   ├── js/app.js            # Application logic
│   └── assets/              # Logo and static assets
├── database/            # MySQL schema
├── scripts/             # Deployment scripts
├── docker-compose.yml   # Production deployment
├── Dockerfile
└── hardhat.config.js    # Hardhat configuration
```

## Quick Start

### 1. Prerequisites
- Node.js >= 18
- MySQL 8.0
- MetaMask wallet with BNB for deployment

### 2. Install Dependencies
```bash
npm install                    # Root (Hardhat)
cd backend && npm install      # Backend
```

### 3. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 4. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit .env with your values
```

### 5. Deploy Smart Contracts
```bash
# Testnet first
npx hardhat run scripts/deploy.js --network bscTestnet

# Then update FACTORY_CONTRACT_ADDRESS in backend/.env
```

### 6. Run Application
```bash
npm start   # or: cd backend && node server.js
```
Visit http://localhost:3000

## Production Deployment (Docker)
```bash
docker-compose up -d
```

## Key Features

| Feature | Description |
|---------|-------------|
| 1v1 PK | Two teams battle; supporters bet on their side |
| Multiplayer PK | Up to 8 teams compete simultaneously |
| Dynamic Bet Limits | 20% growth per stage, free in final 5 minutes |
| Dawn Protocol | Daily 5-8 UTC check-in staking with invite rewards |
| Contribution Rewards | Prize pool split by betting contribution degree |
| 5% Fee Model | Only charged on losing team's principal |
| On-Chain Settlement | All funds managed by smart contracts |

## Smart Contract Flow

1. **Room Creation**: Factory deploys independent PkRoom contract
2. **Betting Phase**: Users approve ERC20 tokens → place bets on teams
3. **Dynamic Limits**: Bet ceiling increases 20% each stage
4. **Settlement**: Owner calls `settleMatch(winningTeam)` → auto-distributes
5. **Claim**: Winners claim rewards proportional to their contribution

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/:id` | Room details |
| GET | `/api/users/:wallet` | User profile |
| PUT | `/api/users/:wallet` | Update settings |
| GET | `/api/leaderboard/:period/:cat` | Rankings |
| GET | `/api/dawn/today` | Dawn pool info |
| GET | `/api/stats` | Platform statistics |
| WS | `/ws` | Live room updates |

## Security

- All funds custodied by smart contracts (no centralized wallet)
- Contract logic immutable after deployment
- Wallet-signature verification for all transactions
- Backend has no access to private keys or funds
- Rate-limited API endpoints

## License

MIT
