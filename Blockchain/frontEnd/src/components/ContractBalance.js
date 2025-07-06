import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./ContractBalance.css";

function ContractBalance({ contractAddress, provider, onClose }) {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBalance() {
      setError("");
      try {
        if (!provider || !contractAddress) {
          setError("Provider or contract address not available.");
          return;
        }
        const bal = await provider.getBalance(contractAddress);
        setBalance(ethers.formatEther(bal));
      } catch (err) {
        setError("Failed to fetch contract balance: " + (err.reason || err.message));
      }
    }
    fetchBalance();
  }, [provider, contractAddress]);

  return (
    <div className="balance-card">
      <h3>Contract Balance</h3>
      <p>{error ? error : balance !== null ? `${balance} ETH` : "Loading..."}</p>
      {/* {onClose && <button className="action-submit" onClick={onClose}>Close</button>} */}
    </div>
  );
}

export default ContractBalance;