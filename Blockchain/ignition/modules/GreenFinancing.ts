import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

module.exports = buildModule("GreenFinancing", (m) => {
  const greenFinancingContract = m.contract("GreenFinancing", [], {
    // You can set the gas price directly in options if needed
    // gasPrice: ethers.parseUnits("50", "gwei"),
  });

  return { greenFinancingContract };
});
