// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";

/**
 * @title PkRoom
 * @dev Independent match room contract handling bets, settlement, and prize distribution.
 *      Deployed by PkRoomFactory for each match. Becomes immutable after settlement.
 */
contract PkRoom {
    enum RoomStatus { WAITING, ACTIVE, SETTLED, CANCELLED }

    uint256 public roomId;
    string public roomName;
    uint8 public maxTeams;
    uint256 public duration;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public initialBetLimit;
    address public betToken;
    address public platformWallet;
    uint256 public platformFeePercent;
    address public creator;
    RoomStatus public status;

    // Betting upper limit growth: 20% per stage
    uint256 public currentBetLimit;
    uint256 public betLimitGrowthPercent = 20;
    uint256 public stageThreshold = 1000 * 1e18; // Threshold to trigger next stage
    uint256 public freeStageWindow = 300; // Last 5 minutes = free stage (seconds)

    // Team data
    mapping(uint8 => uint256) public teamTotalBets;
    mapping(uint8 => address[]) public teamSupporters;
    mapping(uint8 => mapping(address => uint256)) public userBets;
    mapping(address => uint8) public userTeam; // which team user supports
    mapping(address => bool) public hasJoined;

    uint8 public winningTeam;
    bool public winnerDeclared;

    // Reward tracking
    mapping(address => bool) public hasClaimed;
    uint256 public totalPrizePool;
    uint256 public totalFees;

    // Creator reward: 1% of fees
    uint256 public creatorRewardPercent = 1;

    event BetPlaced(address indexed user, uint8 team, uint256 amount);
    event MatchStarted(uint256 startTime, uint256 endTime);
    event MatchSettled(uint8 winningTeam, uint256 prizePool, uint256 fees);
    event RewardClaimed(address indexed user, uint256 amount);
    event MatchCancelled();

    modifier onlyActive() {
        require(status == RoomStatus.ACTIVE, "Match not active");
        require(block.timestamp <= endTime, "Match ended");
        _;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    constructor(
        uint256 _roomId,
        string memory _roomName,
        uint8 _maxTeams,
        uint256 _duration,
        uint256 _initialBetLimit,
        address _betToken,
        address _platformWallet,
        uint256 _platformFeePercent,
        address _creator
    ) {
        roomId = _roomId;
        roomName = _roomName;
        maxTeams = _maxTeams;
        duration = _duration;
        initialBetLimit = _initialBetLimit;
        currentBetLimit = _initialBetLimit;
        betToken = _betToken;
        platformWallet = _platformWallet;
        platformFeePercent = _platformFeePercent;
        creator = _creator;
        status = RoomStatus.WAITING;
    }

    /**
     * @dev Start the match. Can only be called by creator.
     */
    function startMatch() external onlyCreator {
        require(status == RoomStatus.WAITING, "Already started");
        status = RoomStatus.ACTIVE;
        startTime = block.timestamp;
        endTime = block.timestamp + duration;
        emit MatchStarted(startTime, endTime);
    }

    /**
     * @dev Place a bet on a team
     * @param _team Team index (0 to maxTeams-1)
     * @param _amount Amount of tokens to bet
     */
    function placeBet(uint8 _team, uint256 _amount) external onlyActive {
        require(_team < maxTeams, "Invalid team");
        require(_amount > 0, "Amount must be > 0");

        // If user already joined, they must bet on same team
        if (hasJoined[msg.sender]) {
            require(userTeam[msg.sender] == _team, "Cannot switch teams");
        }

        // Check bet limit (unless in free stage)
        if (block.timestamp < endTime - freeStageWindow) {
            require(_amount <= currentBetLimit, "Exceeds bet limit");
        }

        // Transfer tokens from user to this contract
        IERC20(betToken).transferFrom(msg.sender, address(this), _amount);

        // Record bet
        if (!hasJoined[msg.sender]) {
            hasJoined[msg.sender] = true;
            userTeam[msg.sender] = _team;
            teamSupporters[_team].push(msg.sender);
        }

        userBets[_team][msg.sender] += _amount;
        teamTotalBets[_team] += _amount;

        // Check if we need to upgrade bet limit
        if (teamTotalBets[_team] >= stageThreshold) {
            currentBetLimit = currentBetLimit * (100 + betLimitGrowthPercent) / 100;
            stageThreshold = stageThreshold * 2; // Double threshold for next stage
        }

        emit BetPlaced(msg.sender, _team, _amount);
    }

    /**
     * @dev Settle the match. Determines winner and distributes prizes.
     * @param _winningTeam The team that won
     */
    function settleMatch(uint8 _winningTeam) external onlyCreator {
        require(status == RoomStatus.ACTIVE, "Not active");
        require(block.timestamp >= endTime, "Match not ended yet");
        require(_winningTeam < maxTeams, "Invalid team");

        status = RoomStatus.SETTLED;
        winningTeam = _winningTeam;
        winnerDeclared = true;

        // Calculate total losing bets
        uint256 totalLosingBets = 0;
        for (uint8 i = 0; i < maxTeams; i++) {
            if (i != _winningTeam) {
                totalLosingBets += teamTotalBets[i];
            }
        }

        // Calculate fees (only from losing side)
        totalFees = (totalLosingBets * platformFeePercent) / 100;

        // Prize pool = winning team bets + losing team bets - fees
        totalPrizePool = teamTotalBets[_winningTeam] + totalLosingBets - totalFees;

        // Send platform fees
        if (totalFees > 0) {
            uint256 creatorReward = (totalFees * creatorRewardPercent) / 100;
            uint256 platformFee = totalFees - creatorReward;

            IERC20(betToken).transfer(platformWallet, platformFee);
            IERC20(betToken).transfer(creator, creatorReward);
        }

        emit MatchSettled(_winningTeam, totalPrizePool, totalFees);
    }

    /**
     * @dev Claim reward for winning team supporters
     */
    function claimReward() external {
        require(status == RoomStatus.SETTLED, "Not settled");
        require(winnerDeclared, "No winner");
        require(hasJoined[msg.sender], "Did not participate");
        require(userTeam[msg.sender] == winningTeam, "Not on winning team");
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 userBet = userBets[winningTeam][msg.sender];
        require(userBet > 0, "No bet placed");

        // Calculate contribution and reward
        uint256 reward = (totalPrizePool * userBet) / teamTotalBets[winningTeam];

        hasClaimed[msg.sender] = true;
        IERC20(betToken).transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @dev Cancel match and refund all bets (only before settlement)
     */
    function cancelMatch() external onlyCreator {
        require(status == RoomStatus.WAITING || status == RoomStatus.ACTIVE, "Cannot cancel");
        status = RoomStatus.CANCELLED;

        // Refund all bets
        for (uint8 t = 0; t < maxTeams; t++) {
            for (uint256 i = 0; i < teamSupporters[t].length; i++) {
                address supporter = teamSupporters[t][i];
                uint256 bet = userBets[t][supporter];
                if (bet > 0) {
                    userBets[t][supporter] = 0;
                    IERC20(betToken).transfer(supporter, bet);
                }
            }
        }

        emit MatchCancelled();
    }

    // View functions
    function getTeamSupporters(uint8 _team) external view returns (address[] memory) {
        return teamSupporters[_team];
    }

    function getUserContribution(address _user) external view returns (uint256) {
        if (!hasJoined[_user]) return 0;
        uint8 team = userTeam[_user];
        if (teamTotalBets[team] == 0) return 0;
        return (userBets[team][_user] * 1e18) / teamTotalBets[team];
    }

    function getTimeRemaining() external view returns (uint256) {
        if (status != RoomStatus.ACTIVE || block.timestamp >= endTime) return 0;
        return endTime - block.timestamp;
    }

    function isInFreeStage() external view returns (bool) {
        if (status != RoomStatus.ACTIVE) return false;
        return block.timestamp >= endTime - freeStageWindow;
    }

    function getRoomSummary() external view returns (
        string memory _name,
        RoomStatus _status,
        uint8 _maxTeams,
        uint256 _endTime,
        uint8 _winTeam,
        uint256 _prizePool
    ) {
        return (roomName, status, maxTeams, endTime, winningTeam, totalPrizePool);
    }
}
