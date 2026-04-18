require('dotenv').config();

const FACTORY_ABI = [
  "event RoomCreated(uint256 indexed roomId, address indexed roomAddress, address indexed creator, string roomName, uint8 maxTeams, uint256 duration, uint256 initialBetLimit)",
  "function roomCount() view returns (uint256)",
  "function rooms(uint256) view returns (address roomAddress, address creator, uint256 createdAt, string roomName, uint8 maxTeams)",
  "function createRoom(string roomName, uint8 maxTeams, uint256 duration, uint256 initialBetLimit, address betToken) returns (address)",
  "function getRoomInfo(uint256 roomId) view returns (tuple(address roomAddress, address creator, uint256 createdAt, string roomName, uint8 maxTeams))"
];

const ROOM_ABI = [
  "event BetPlaced(address indexed user, uint8 team, uint256 amount)",
  "event MatchStarted(uint256 startTime, uint256 endTime)",
  "event MatchSettled(uint8 winningTeam, uint256 prizePool, uint256 fees)",
  "event RewardClaimed(address indexed user, uint256 amount)",
  "event MatchCancelled()",
  "function roomId() view returns (uint256)",
  "function roomName() view returns (string)",
  "function maxTeams() view returns (uint8)",
  "function status() view returns (uint8)",
  "function startTime() view returns (uint256)",
  "function endTime() view returns (uint256)",
  "function teamTotalBets(uint8) view returns (uint256)",
  "function userBets(uint8, address) view returns (uint256)",
  "function winningTeam() view returns (uint8)",
  "function totalPrizePool() view returns (uint256)",
  "function totalFees() view returns (uint256)",
  "function currentBetLimit() view returns (uint256)",
  "function getTimeRemaining() view returns (uint256)",
  "function isInFreeStage() view returns (bool)",
  "function getUserContribution(address) view returns (uint256)",
  "function getRoomSummary() view returns (string, uint8, uint8, uint256, uint8, uint256)",
  "function placeBet(uint8 team, uint256 amount)",
  "function claimReward()",
  "function settleMatch(uint8 winningTeam)",
  "function startMatch()"
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

module.exports = {
  FACTORY_ABI,
  ROOM_ABI,
  ERC20_ABI,
  FACTORY_ADDRESS: process.env.FACTORY_CONTRACT_ADDRESS,
  DAWN_ADDRESS: process.env.DAWN_CONTRACT_ADDRESS,
  BET_TOKEN_ADDRESS: process.env.BET_TOKEN_ADDRESS,
  BSC_RPC_URL: process.env.BSC_RPC_URL,
  BSC_WS_URL: process.env.BSC_WEBSOCKET_URL,
  CHAIN_ID: parseInt(process.env.BSC_CHAIN_ID || '56'),
};
