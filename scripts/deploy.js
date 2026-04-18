const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "BNB");

  // ── 1. Deploy PkRoomFactory ────────────────────
  const platformWallet = process.env.PLATFORM_WALLET_ADDRESS || deployer.address;

  const Factory = await hre.ethers.getContractFactory("PkRoomFactory");
  const factory = await Factory.deploy(platformWallet);
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("PkRoomFactory deployed to:", factoryAddr);

  // ── 2. Deploy DawnProtocol ─────────────────────
  const betToken = process.env.BET_TOKEN_ADDRESS;
  if (!betToken || betToken === "0x0000000000000000000000000000000000000000") {
    console.log("WARNING: BET_TOKEN_ADDRESS not set. Skipping DawnProtocol deployment.");
  } else {
    const Dawn = await hre.ethers.getContractFactory("DawnProtocol");
    const dawn = await Dawn.deploy(betToken);
    await dawn.waitForDeployment();
    const dawnAddr = await dawn.getAddress();
    console.log("DawnProtocol deployed to:", dawnAddr);
  }

  // ── 3. Verify on BSCScan (optional) ────────────
  if (process.env.BSCSCAN_API_KEY) {
    console.log("Verifying contracts on BSCScan...");
    try {
      await hre.run("verify:verify", {
        address: factoryAddr,
        constructorArguments: [platformWallet],
      });
      console.log("Factory verified!");
    } catch (e) {
      console.log("Verification failed:", e.message);
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log("  Deployment Complete!");
  console.log("  Factory:  ", factoryAddr);
  console.log("  Platform: ", platformWallet);
  console.log("═══════════════════════════════════════");
  console.log("\nUpdate these addresses in:");
  console.log("  - backend/.env (FACTORY_CONTRACT_ADDRESS)");
  console.log("  - frontend/js/web3.js (CONTRACTS.factory)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
