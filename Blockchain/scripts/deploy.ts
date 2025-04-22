import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-ethers";

async function main() {
    const GreenFinancing = await ethers.getContractFactory("GreenFinancing");

    // Set the gas price manually
    const gasPrice = ethers.parseUnits("50", "gwei"); // Adjust if needed

    const greenFinancingContract = await GreenFinancing.deploy({ gasPrice });

    const receipt = await greenFinancingContract.waitForDeployment();

    console.log("GreenFinancing contract deployed to:", receipt.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
