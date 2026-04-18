// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PkRoom.sol";

/**
 * @title PkRoomFactory
 * @dev Factory contract for creating independent PK match rooms.
 *      Each room is a separate PkRoom contract deployed on BSC.
 */
contract PkRoomFactory {
    address public owner;
    address public platformWallet;
    uint256 public platformFeePercent = 5; // 5% fee on losing team
    uint256 public roomCount;

    struct RoomInfo {
        address roomAddress;
        address creator;
        uint256 createdAt;
        string roomName;
        uint8 maxTeams; // 2 for 1v1, up to 8 for multiplayer
    }

    mapping(uint256 => RoomInfo) public rooms;
    mapping(address => uint256[]) public creatorRooms;
    mapping(address => bool) public isRoom;

    event RoomCreated(
        uint256 indexed roomId,
        address indexed roomAddress,
        address indexed creator,
        string roomName,
        uint8 maxTeams,
        uint256 duration,
        uint256 initialBetLimit
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _platformWallet) {
        owner = msg.sender;
        platformWallet = _platformWallet;
    }

    /**
     * @dev Create a new PK match room
     * @param _roomName Name of the match room
     * @param _maxTeams Number of teams (2-8)
     * @param _duration Match duration in seconds
     * @param _initialBetLimit Initial per-bet upper limit in wei
     * @param _betToken Address of the ERC20 token used for betting (U token)
     */
    function createRoom(
        string memory _roomName,
        uint8 _maxTeams,
        uint256 _duration,
        uint256 _initialBetLimit,
        address _betToken
    ) external returns (address) {
        require(_maxTeams >= 2 && _maxTeams <= 8, "Teams must be 2-8");
        require(_duration >= 300, "Min duration 5 minutes");
        require(_initialBetLimit > 0, "Bet limit must be > 0");
        require(_betToken != address(0), "Invalid token address");

        PkRoom newRoom = new PkRoom(
            roomCount,
            _roomName,
            _maxTeams,
            _duration,
            _initialBetLimit,
            _betToken,
            platformWallet,
            platformFeePercent,
            msg.sender
        );

        RoomInfo memory info = RoomInfo({
            roomAddress: address(newRoom),
            creator: msg.sender,
            createdAt: block.timestamp,
            roomName: _roomName,
            maxTeams: _maxTeams
        });

        rooms[roomCount] = info;
        creatorRooms[msg.sender].push(roomCount);
        isRoom[address(newRoom)] = true;

        emit RoomCreated(
            roomCount,
            address(newRoom),
            msg.sender,
            _roomName,
            _maxTeams,
            _duration,
            _initialBetLimit
        );

        roomCount++;
        return address(newRoom);
    }

    function getCreatorRooms(address _creator) external view returns (uint256[] memory) {
        return creatorRooms[_creator];
    }

    function getRoomInfo(uint256 _roomId) external view returns (RoomInfo memory) {
        return rooms[_roomId];
    }

    function updatePlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        platformWallet = _newWallet;
    }

    function updateFeePercent(uint256 _newFee) external onlyOwner {
        require(_newFee <= 10, "Fee too high");
        platformFeePercent = _newFee;
    }
}
