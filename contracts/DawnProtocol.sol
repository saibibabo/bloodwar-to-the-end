// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";

/**
 * @title DawnProtocol
 * @dev Daily check-in staking mechanism. Users deposit small amounts during
 *      the check-in window (5:00-8:00 UTC). On-time users get rewarded from
 *      latecomers' deposits. Invitation system with computing power bonuses.
 */
contract DawnProtocol {
    address public owner;
    address public betToken;

    uint256 public depositAmount = 1 * 1e18; // 1 U max deposit
    uint256 public checkInStartHour = 5;  // 5:00 UTC
    uint256 public checkInEndHour = 8;    // 8:00 UTC

    struct DayPool {
        uint256 totalDeposits;
        uint256 onTimeCount;
        uint256 lateCount;
        uint256 latePool;
        mapping(address => bool) checkedIn;
        mapping(address => bool) isOnTime;
        mapping(address => uint256) checkInOrder;
        address[] onTimeUsers;
    }

    mapping(uint256 => DayPool) public dayPools; // dayId => pool

    // Invitation system
    mapping(address => address) public inviter;
    mapping(address => uint256) public inviteCount;
    mapping(address => uint256) public computingPowerBonus; // basis points, 500 = 5%
    mapping(address => uint256) public newbieShieldRemaining; // check-ins with shield

    // Dawn Squad: NFT medal tracking
    mapping(bytes32 => uint256) public squadStreaks; // squadHash => consecutive days
    mapping(address => bool) public hasMedal;

    event CheckedIn(address indexed user, uint256 dayId, bool onTime, uint256 order);
    event RewardClaimed(address indexed user, uint256 dayId, uint256 amount);
    event Invited(address indexed inviter, address indexed invitee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _betToken) {
        owner = msg.sender;
        betToken = _betToken;
    }

    function getCurrentDayId() public view returns (uint256) {
        return block.timestamp / 86400;
    }

    function isCheckInWindow() public view returns (bool) {
        uint256 hourOfDay = (block.timestamp % 86400) / 3600;
        return hourOfDay >= checkInStartHour && hourOfDay < checkInEndHour;
    }

    /**
     * @dev Register invitation relationship
     */
    function registerInvite(address _inviter) external {
        require(inviter[msg.sender] == address(0), "Already invited");
        require(_inviter != msg.sender, "Cannot invite self");
        require(_inviter != address(0), "Invalid inviter");

        inviter[msg.sender] = _inviter;
        inviteCount[_inviter]++;

        // Newbie shield: 3 late check-ins get 50% back
        newbieShieldRemaining[msg.sender] = 3;

        // Inviter computing power bonus: +5% per invite (capped at 100%)
        if (computingPowerBonus[_inviter] < 10000) {
            computingPowerBonus[_inviter] += 500;
        }

        emit Invited(_inviter, msg.sender);
    }

    /**
     * @dev Check in for today
     */
    function checkIn() external {
        uint256 dayId = getCurrentDayId();
        DayPool storage pool = dayPools[dayId];

        require(!pool.checkedIn[msg.sender], "Already checked in today");

        // Transfer deposit
        IERC20(betToken).transferFrom(msg.sender, address(this), depositAmount);

        pool.checkedIn[msg.sender] = true;
        pool.totalDeposits += depositAmount;

        bool onTime = isCheckInWindow();

        if (onTime) {
            pool.isOnTime[msg.sender] = true;
            pool.onTimeCount++;
            pool.checkInOrder[msg.sender] = pool.onTimeCount;
            pool.onTimeUsers.push(msg.sender);
        } else {
            pool.lateCount++;
            pool.latePool += depositAmount;

            // Newbie shield: return 50% if applicable
            if (newbieShieldRemaining[msg.sender] > 0) {
                newbieShieldRemaining[msg.sender]--;
                uint256 refund = depositAmount / 2;
                pool.latePool -= refund;
                IERC20(betToken).transfer(msg.sender, refund);
            }
        }

        emit CheckedIn(msg.sender, dayId, onTime, onTime ? pool.onTimeCount : 0);
    }

    /**
     * @dev Claim reward for a specific day (on-time users only)
     */
    function claimDayReward(uint256 _dayId) external {
        DayPool storage pool = dayPools[_dayId];
        require(pool.isOnTime[msg.sender], "Not on time for this day");
        require(_dayId < getCurrentDayId(), "Day not ended yet");

        uint256 baseWeight = 1e18;
        uint256 bonusBps = computingPowerBonus[msg.sender];
        uint256 userWeight = baseWeight + (baseWeight * bonusBps / 10000);

        // Calculate total weight
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < pool.onTimeUsers.length; i++) {
            address u = pool.onTimeUsers[i];
            uint256 w = 1e18 + (1e18 * computingPowerBonus[u] / 10000);
            totalWeight += w;
        }

        // User's share of the late pool + returned deposits
        uint256 reward = (pool.latePool * userWeight) / totalWeight;
        reward += depositAmount; // Return their own deposit

        pool.isOnTime[msg.sender] = false; // Prevent double claim
        IERC20(betToken).transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, _dayId, reward);
    }

    function updateDepositAmount(uint256 _amount) external onlyOwner {
        require(_amount <= 10 * 1e18, "Max 10 U");
        depositAmount = _amount;
    }
}
