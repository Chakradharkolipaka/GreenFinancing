import React, { useState } from "react";
import { ethers } from "ethers";
import "./StartProjectForm.css";
import contractABI from "../abi/GreenFinancingABI.json";

function StartProjectForm({ signer, contractAddress, onActionComplete }) {
  const [cost, setCost] = useState("");
  const [message, setMessage] = useState("");

  const handleStartProject = async (e) => {
    e.preventDefault();
    if (!signer) {
      setMessage("Please connect your wallet.");
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
      const tx = await contract.startProject(ethers.parseEther(cost));
      await tx.wait();
      setMessage("Project started successfully!");
      setCost("");
      if (onActionComplete) onActionComplete();
    } catch (err) {
      // If error is ENS related, show a more helpful message
      if (err.code === 'UNSUPPORTED_OPERATION' && err.operation === 'getEnsAddress') {
        setMessage("Start project failed: ENS is not supported on this network. Please use a plain address.");
      } else {
        setMessage("Start project failed: " + (err.reason || err.message));
      }
    }
  };

  return (
    <form className="action-form" onSubmit={handleStartProject}>
      <h2>Start New Project</h2>
      <input
        type="number"
        className="action-input"
        placeholder="Project Cost in ETH"
        value={cost}
        onChange={e => setCost(e.target.value)}
        required
      />
      <button type="submit" className="action-submit">Start Project</button>
      {message && <div className="action-message">{message}</div>}
    </form>
  );
}

export default StartProjectForm;