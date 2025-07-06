import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/GreenFinancingABI.json";
import "./GetProjectDetails.css";

function GetProjectDetails({ contractAddress, provider, onClose }) {
  const [details, setDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

  const handleGetDetails = async () => {
    setError("");
    try {
      if (!provider || !contractAddress) {
        setError("Provider or contract address not available.");
        return;
      }
      const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
      const [owner, projectCost, totalFundsRaised, fundsAllocated, projectStarted] = await contract.getProjectDetails();
      // Only show popup, do not append duplicate if already open
      setDetails({
        owner,
        projectCost: projectCost.toString(),
        totalFundsRaised: totalFundsRaised.toString(),
        fundsAllocated: fundsAllocated.toString(),
        projectStarted
      });
      setShowPopup(true);
    } catch (err) {
      setError("Failed to fetch project details: " + (err.reason || err.message));
    }
  };

  // Only allow one popup at a time
  const closePopup = () => setShowPopup(false);

  return (
    <div className="action-form get-project-details-form">
      <h2>Get Project Details</h2>
      <button className="fetch-details-btn" onClick={handleGetDetails}>
        Fetch Details
      </button>
      {error && <div className="action-message error">{error}</div>}
      {showPopup && details && (
        <div className="details-form-modal modal-overlay" onClick={closePopup}>
          <div className="modal-content project-details-content" onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#fff',marginBottom:'1rem'}}>Project Details</h3>
            <div className="project-details-card" style={{background:'#fff',borderRadius:12,padding:'1.5rem 1rem',boxShadow:'0 2px 8px #1976d233',marginBottom:'1.2rem',width:'100%',maxWidth:400}}>
              <div className="project-detail-row"><span className="label">Owner:</span> <span className="value">{details.owner}</span></div>
              <div className="project-detail-row"><span className="label">Project Cost:</span> <span className="value">{(Number(details.projectCost) / 1e18).toFixed(4)} ETH</span></div>
              <div className="project-detail-row"><span className="label">Funds Allocated:</span> <span className="value">{(Number(details.fundsAllocated) / 1e18).toFixed(4)} ETH</span></div>
              <div className="project-detail-row"><span className="label">Total Raised:</span> <span className="value">{(Number(details.totalFundsRaised)/1e18).toFixed(4)} ETH</span></div>
              <div className="project-detail-row"><span className="label">Project Started:</span> <span className="value">{details.projectStarted ? "Yes" : "No"}</span></div>
            </div>
            <button className="popup-close fetch-details-btn" onClick={closePopup} style={{marginTop:0}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetProjectDetails;