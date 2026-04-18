const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PkRoomFactory", function () {
  let factory, token, owner, user1, user2, user3;
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy a mock ERC20 token for betting
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("TestUSD", "TUSD", INITIAL_SUPPLY);
    await token.waitForDeployment();

    // Distribute tokens
    await token.transfer(user1.address, ethers.parseEther("10000"));
    await token.transfer(user2.address, ethers.parseEther("10000"));
    await token.transfer(user3.address, ethers.parseEther("10000"));

    // Deploy factory
    const Factory = await ethers.getContractFactory("PkRoomFactory");
    factory = await Factory.deploy(owner.address);
    await factory.waitForDeployment();
  });

  describe("Room Creation", function () {
    it("should create a new room", async function () {
      const tx = await factory.connect(user1).createRoom(
        "Test Battle",
        2,
        1800, // 30 minutes
        ethers.parseEther("100"),
        await token.getAddress()
      );
      const receipt = await tx.wait();
      expect(await factory.roomCount()).to.equal(1);
    });

    it("should emit RoomCreated event", async function () {
      await expect(factory.connect(user1).createRoom(
        "Test Battle", 2, 1800, ethers.parseEther("100"), await token.getAddress()
      )).to.emit(factory, "RoomCreated");
    });

    it("should reject invalid team count", async function () {
      await expect(factory.connect(user1).createRoom(
        "Bad Room", 1, 1800, ethers.parseEther("100"), await token.getAddress()
      )).to.be.reverted;
    });

    it("should reject more than 8 teams", async function () {
      await expect(factory.connect(user1).createRoom(
        "Bad Room", 9, 1800, ethers.parseEther("100"), await token.getAddress()
      )).to.be.reverted;
    });
  });

  describe("PkRoom - Betting", function () {
    let room, roomAddress;

    beforeEach(async function () {
      const tx = await factory.connect(user1).createRoom(
        "Battle Room", 2, 1800, ethers.parseEther("100"), await token.getAddress()
      );
      const receipt = await tx.wait();
      const roomInfo = await factory.getRoomInfo(0);
      roomAddress = roomInfo.roomAddress;
      room = await ethers.getContractAt("PkRoom", roomAddress);
    });

    it("should accept bets after match starts", async function () {
      // Start match
      await room.connect(user1).startMatch();

      // Approve and bet
      const betAmount = ethers.parseEther("50");
      await token.connect(user2).approve(roomAddress, betAmount);
      await room.connect(user2).placeBet(0, betAmount);

      expect(await room.teamTotalBets(0)).to.equal(betAmount);
    });

    it("should reject bets before match starts", async function () {
      const betAmount = ethers.parseEther("50");
      await token.connect(user2).approve(roomAddress, betAmount);
      await expect(room.connect(user2).placeBet(0, betAmount)).to.be.reverted;
    });

    it("should enforce bet limits", async function () {
      await room.connect(user1).startMatch();

      const overLimit = ethers.parseEther("200"); // limit is 100
      await token.connect(user2).approve(roomAddress, overLimit);
      await expect(room.connect(user2).placeBet(0, overLimit)).to.be.reverted;
    });

    it("should track bets per user", async function () {
      await room.connect(user1).startMatch();

      const bet = ethers.parseEther("50");
      await token.connect(user2).approve(roomAddress, bet);
      await room.connect(user2).placeBet(0, bet);

      expect(await room.userBets(0, user2.address)).to.equal(bet);
    });
  });

  describe("PkRoom - Settlement", function () {
    let room, roomAddress;

    beforeEach(async function () {
      const tx = await factory.connect(user1).createRoom(
        "Settlement Test", 2, 60, ethers.parseEther("1000"), await token.getAddress()
      );
      const receipt = await tx.wait();
      const roomInfo = await factory.getRoomInfo(0);
      roomAddress = roomInfo.roomAddress;
      room = await ethers.getContractAt("PkRoom", roomAddress);

      await room.connect(user1).startMatch();

      // User2 bets on Team A
      await token.connect(user2).approve(roomAddress, ethers.parseEther("500"));
      await room.connect(user2).placeBet(0, ethers.parseEther("500"));

      // User3 bets on Team B
      await token.connect(user3).approve(roomAddress, ethers.parseEther("700"));
      await room.connect(user3).placeBet(1, ethers.parseEther("700"));
    });

    it("should settle match and distribute rewards", async function () {
      // Fast forward past match end
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");

      // Settle: Team B wins
      await room.connect(user1).settleMatch(1);

      expect(await room.status()).to.equal(2); // SETTLED

      // User3 should be able to claim
      const balBefore = await token.balanceOf(user3.address);
      await room.connect(user3).claimReward();
      const balAfter = await token.balanceOf(user3.address);

      // User3's reward should be > their bet (700 + share of loser pool)
      expect(balAfter).to.be.gt(balBefore);
    });

    it("should deduct 5% fee from losing team only", async function () {
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");

      await room.connect(user1).settleMatch(1); // Team B wins

      // Fee = 500 * 5% = 25
      const fees = await room.totalFees();
      expect(fees).to.equal(ethers.parseEther("25"));
    });

    it("should reject double claims", async function () {
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");
      await room.connect(user1).settleMatch(1);

      await room.connect(user3).claimReward();
      await expect(room.connect(user3).claimReward()).to.be.reverted;
    });

    it("should refund losers nothing from prize pool", async function () {
      await ethers.provider.send("evm_increaseTime", [120]);
      await ethers.provider.send("evm_mine");
      await room.connect(user1).settleMatch(1);

      // User2 (loser) should not be able to claim
      await expect(room.connect(user2).claimReward()).to.be.reverted;
    });
  });
});
