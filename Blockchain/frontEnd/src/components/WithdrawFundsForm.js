import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./WithdrawFundsForm.css";
import contractABI from "../abi/GreenFinancingABI.json";

function WithdrawFundsForm({ signer, contractAddress, onActionComplete, admin }) {
  const [amount, setAmount] = useState("");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [allocatedFunds, setAllocatedFunds] = useState(null);

  useEffect(() => {
    async function fetchAllocatedFunds() {
      if (!signer || !contractAddress) return;
      try {
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        const details = await contract.getProjectDetails();
        setAllocatedFunds(Number(details[3]) / 1e18); // fundsAllocated
      } catch (err) {
        setAllocatedFunds(null);
      }
    }
    fetchAllocatedFunds();
  }, [signer, contractAddress]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!signer) {
      setMessage("Please connect your wallet.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/blockchain/withdrawFunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, admin: admin || "admin@email.com", review })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Funds withdrawn successfully!");
        setAmount("");
        setReview("");
        if (onActionComplete) onActionComplete();
      } else {
        setMessage(data.error || "Withdrawal failed");
      }
    } catch (err) {
      setMessage("Withdrawal failed: " + err.message);
    }
  };

  return (
    <form className="action-form" onSubmit={handleWithdraw}>
      <h2>Withdraw Funds</h2>
      <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: 8 }}>
        Allocated Funds: {allocatedFunds !== null ? `${allocatedFunds.toFixed(4)} ETH` : "-"}
      </div>
      <input
        type="number"
        className="action-input"
        placeholder="Amount in ETH"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <textarea
        className="action-input"
        placeholder="Admin review (optional)"
        value={review}
        onChange={e => setReview(e.target.value)}
        style={{ minHeight: 40 }}
      />
      <button type="submit" className="action-submit">Withdraw Funds</button>
      {message && <div className="action-message">{message}</div>}
    </form>
  );
}

export default WithdrawFundsForm;