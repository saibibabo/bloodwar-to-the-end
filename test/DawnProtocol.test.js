const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DawnProtocol", function () {
  let dawn, token, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("TestUSD", "TUSD", ethers.parseEther("1000000"));
    await token.waitForDeployment();

    await token.transfer(user1.address, ethers.parseEther("1000"));
    await token.transfer(user2.address, ethers.parseEther("1000"));

    const Dawn = await ethers.getContractFactory("DawnProtocol");
    dawn = await Dawn.deploy(await token.getAddress());
    await dawn.waitForDeployment();
  });

  it("should accept check-in deposits", async function () {
    const deposit = ethers.parseEther("1");
    await token.connect(user1).approve(await dawn.getAddress(), deposit);
    await dawn.connect(user1).checkIn(deposit);

    const dayId = Math.floor(Date.now() / 1000 / 86400);
    const info = await dawn.getUserCheckIn(dayId, user1.address);
    expect(info.amount).to.equal(deposit);
  });

  it("should enforce max deposit of 1 U", async function () {
    const tooMuch = ethers.parseEther("2");
    await token.connect(user1).approve(await dawn.getAddress(), tooMuch);
    await expect(dawn.connect(user1).checkIn(tooMuch)).to.be.reverted;
  });

  it("should prevent double check-in same day", async function () {
    const deposit = ethers.parseEther("1");
    await token.connect(user1).approve(await dawn.getAddress(), ethers.parseEther("2"));
    await dawn.connect(user1).checkIn(deposit);
    await expect(dawn.connect(user1).checkIn(deposit)).to.be.reverted;
  });

  it("should track invite computing power bonus", async function () {
    // Register invite
    await dawn.connect(user1).registerInvite(user2.address);
    const power = await dawn.computingPower(user1.address);
    expect(power).to.be.gt(0);
  });
});
