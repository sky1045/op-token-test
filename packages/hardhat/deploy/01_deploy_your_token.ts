import { NomicLabsHardhatPluginError } from 'hardhat/plugins'
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourToken", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const yourToken = await hre.ethers.getContract<Contract>("YourToken", deployer);
  const yourTokenAddress = await yourToken.getAddress();
  console.log("yourToken address: " + yourTokenAddress);

  await deploy("Vendor", {
    from: deployer,
    // Contract constructor arguments
    args: [yourTokenAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const vendor = await hre.ethers.getContract<Contract>("Vendor", deployer);
  const vendorAddress = vendor.getAddress();
  console.log("vendor address: " + vendorAddress);

  // while (true) {
  //   try {
  //     await Promise.race([
  //       hre.run("verify:verify", {
  //         address,
  //         contract: Object.entries(JSON.parse((await hre.deployments.get('YourToken'))['metadata']!)['settings']['compilationTarget'])[0].join(':'),
  //       }),
  //       new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000))
  //     ])
  //     break;
  //   } catch(e) {
  //     if (e instanceof NomicLabsHardhatPluginError && e.message.includes("Message: Unknown UID")) break;
  //     if (e instanceof Error && e.message == "timeout") continue;
  //     throw e;
  //   }
  // }
};

export default deployYourToken;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourToken.tags = ["YourToken"];
