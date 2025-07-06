import React, { useState } from "react";
import { ethers } from "ethers";
import "./ContributeForm.css";
import contractABI from "../abi/GreenFinancingABI.json";

function ContributeForm({ signer, contractAddress, onActionComplete }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!signer) {
      setMessage("Please connect your wallet.");
      return;
    }
    try {
      // Ensure contractAddress is a plain address, not ENS
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.contribute({ value: ethers.parseEther(amount) });
      await tx.wait();
      setMessage("Contribution successful!");

      // Log to backend
      await fetch('/api/blockchain/log-investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributor: await signer.getAddress(),
          amount,
          txHash: tx.hash,
          timestamp: new Date().toISOString()
        })
      });

      setAmount("");
      if (onActionComplete) onActionComplete();
    } catch (err) {
      // If error is ENS related, show a more helpful message
      if (err.code === 'UNSUPPORTED_OPERATION' && err.operation === 'getEnsAddress') {
        setMessage("Contribution failed: ENS is not supported on this network. Please use a plain address.");
      } else {
        setMessage("Contribution failed: " + (err.reason || err.message));
      }
    }
  };

  return (
    <form className="action-form" onSubmit={handleContribute}>
      <h2>Contribute to Project</h2>
      <input
        type="number"
        className="action-input"
        placeholder="Amount in ETH"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit" className="action-submit">Contribute</button>
      {message && <div className="action-message">{message}</div>}
    </form>
  );
}

export default ContributeForm;