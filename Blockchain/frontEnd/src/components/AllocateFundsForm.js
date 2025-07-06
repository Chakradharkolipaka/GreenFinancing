import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./AllocateFundsForm.css";
import contractABI from "../abi/GreenFinancingABI.json";

function AllocateFundsForm({ signer, contractAddress, onActionComplete }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [availableFunds, setAvailableFunds] = useState(null);

  useEffect(() => {
    async function fetchAvailableFunds() {
      if (!signer || !contractAddress) return;
      try {
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        const details = await contract.getProjectDetails();
        // available funds = totalFundsRaised - fundsAllocated
        const available = (Number(details[2]) - Number(details[3])) / 1e18;
        setAvailableFunds(available);
      } catch (err) {
        setAvailableFunds(null);
      }
    }
    fetchAvailableFunds();
  }, [signer, contractAddress]);

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!signer) {
      setMessage("Please connect your wallet.");
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.allocateFunds(ethers.parseEther(amount));
      await tx.wait();
      setMessage("Funds allocated successfully!");
      setAmount("");
      if (onActionComplete) onActionComplete();
    } catch (err) {
      if (err.code === 'UNSUPPORTED_OPERATION' && err.operation === 'getEnsAddress') {
        setMessage("Allocation failed: ENS is not supported on this network. Please use a plain address.");
      } else {
        setMessage("Allocation failed: " + (err.reason || err.message));
      }
    }
  };

  return (
    <form className="action-form" onSubmit={handleAllocate}>
      <h2>Allocate Funds</h2>
      <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: 8 }}>
        Available Funds: {availableFunds !== null ? `${availableFunds.toFixed(4)} ETH` : "-"}
      </div>
      <input
        type="number"
        className="action-input"
        placeholder="Amount in ETH"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit" className="action-submit">Allocate Funds</button>
      {message && <div className="action-message">{message}</div>}
    </form>
  );
}

export default AllocateFundsForm;