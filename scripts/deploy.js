// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contract with account:", deployer.address);
  
    const Concordia = await ethers.getContractFactory("Concordia");
    const concordia = await Concordia.deploy();
  
    console.log("Contract deployed to:", concordia.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  