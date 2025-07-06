import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './AdminHomePage.css';
import metamaskLogo from "./assets/metamask.png";
import ContributeForm from "./components/ContributeForm";
import StartProjectForm from "./components/StartProjectForm";
import AllocateFundsForm from "./components/AllocateFundsForm";
import WithdrawFundsForm from "./components/WithdrawFundsForm";
import ContractBalance from "./components/ContractBalance";
import GetProjectDetails from "./components/GetProjectDetails";

// Set your contract address here if not using .env
const CONTRACT_ADDRESS = "0x3e9F8fAF19ea56DDc302eE7e6f2441C1f1127Adf"; // <-- Replace with actual deployed contract address

function AdminHomePage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    activeProjects: 0,
    investments: [],
  });
  const [recentInvestments, setRecentInvestments] = useState([]);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [showContribute, setShowContribute] = useState(false);
  const [showStartProject, setShowStartProject] = useState(false);
  const [showAllocateFunds, setShowAllocateFunds] = useState(false);
  const [showWithdrawFunds, setShowWithdrawFunds] = useState(false);
  const [showContractBalance, setShowContractBalance] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/adminloginpage');
      return;
    }
    setAdmin(JSON.parse(adminData));
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetch('/api/blockchain/recent-investments')
      .then(res => res.json())
      .then(data => setRecentInvestments(data))
      .catch(err => console.error("Error fetching recent investments:", err));
  }, []);

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, [admin]); // re-connect wallet on admin login/logout

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/blockchain/projectDetails');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(prev => ({
          ...prev,
          totalInvestment: data.totalFundsRaised ? parseFloat(data.totalFundsRaised) / 1e18 : 0,
          activeProjects: data.projectStarted ? 1 : 0
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send("eth_requestAccounts", []);
        const signer = await ethProvider.getSigner();
        setProvider(ethProvider);
        setSigner(signer);
        setWalletAddress(await signer.getAddress());
      } catch (err) {
        alert("Wallet connection failed: " + err.message);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/adminloginpage');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>GreenFinancing Admin Dashboard</h1>
        <nav className="blockchain-actions-nav">
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn contribute-btn"
              style={{ minWidth: 0, padding: '0.7rem 1.3rem', borderRadius: 6, fontSize: '1rem', fontWeight: 600 }}
              onClick={() => setShowContribute(true)}
            >Contribute</button>
            {showContribute && (
              <div className="modal-overlay" onClick={() => setShowContribute(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <ContributeForm 
                    signer={signer}
                    contractAddress={CONTRACT_ADDRESS}
                    onClose={() => setShowContribute(false)}
                    provider={provider}
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn start-btn"
              onClick={() => setShowStartProject(true)}
            >Start Project</button>
            {showStartProject && (
              <div className="modal-overlay" onClick={() => setShowStartProject(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <StartProjectForm 
                    signer={signer}
                    contractAddress={CONTRACT_ADDRESS}
                    onClose={() => setShowStartProject(false)}
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn allocate-btn"
              onClick={() => setShowAllocateFunds(true)}
            >Allocate Funds</button>
            {showAllocateFunds && (
              <div className="modal-overlay" onClick={() => setShowAllocateFunds(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <AllocateFundsForm 
                    signer={signer}
                    contractAddress={CONTRACT_ADDRESS}
                    onClose={() => setShowAllocateFunds(false)}
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn withdraw-btn"
              onClick={() => setShowWithdrawFunds(true)}
            >Withdraw Funds</button>
            {showWithdrawFunds && (
              <div className="modal-overlay" onClick={() => setShowWithdrawFunds(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <WithdrawFundsForm 
                    signer={signer}
                    contractAddress={CONTRACT_ADDRESS}
                    onClose={() => setShowWithdrawFunds(false)}
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn balance-btn"
              onClick={() => {
                if (!provider) {
                  alert('Please connect MetaMask to view contract balance.');
                  return;
                }
                setShowContractBalance(true);
              }}
              disabled={!provider}
              style={!provider ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Contract Balance
            </button>
            {showContractBalance && (
              <div className="modal-overlay" onClick={() => setShowContractBalance(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <ContractBalance 
                    contractAddress={CONTRACT_ADDRESS}
                    provider={provider}
                    onClose={() => setShowContractBalance(false)} 
                  />
                </div>
              </div>
            )}
          </div>
          <div style={{display:'inline-block'}}>
            <button
              className="nav-action-btn details-btn"
              onClick={() => {
                if (!provider) {
                  alert('Please connect MetaMask to view project details.');
                  return;
                }
                setShowProjectDetails(true);
              }}
              disabled={!provider}
              style={!provider ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Project Details
            </button>
            {showProjectDetails && (
              <div className="modal-overlay" onClick={() => setShowProjectDetails(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <GetProjectDetails 
                    contractAddress={CONTRACT_ADDRESS}
                    provider={provider}
                    onProjectDetailsChange={fetchDashboardData}
                    onClose={() => {
                      setShowProjectDetails(false);
                      fetchDashboardData();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
            tabIndex={0}
            onFocus={() => setShowAdminMenu(true)}
            onBlur={() => setShowAdminMenu(false)}
          >
            <button
              className="admin-avatar-btn"
              style={{
                width: 48, height: 48, borderRadius: '50%', border: 'none', background: '#e8f5e9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(56,142,60,0.08)', zIndex: 21
              }}
              onClick={() => setShowAdminMenu(v => !v)}
              aria-label="Admin details"
              tabIndex={0}
            >
              <span style={{ fontSize: 28, color: '#388e3c', fontWeight: 700 }}>{admin?.email?.[0]?.toUpperCase() || 'A'}</span>
            </button>
            {showAdminMenu && (
              <div style={{ position: 'absolute', top: 56, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 30, padding: 16, transition: 'opacity 0.2s' }}>
                <div style={{ fontWeight: 600, color: '#388e3c', marginBottom: 8 }}>Admin</div>
                <div style={{ fontSize: 15, marginBottom: 4 }}><b>Email:</b> {admin?.email}</div>
                <button className="logout-btn" style={{ width: '100%', marginTop: 12 }} onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '2.2rem 0 1.2rem 0' }}>
        <div className="connect-metamask-section">
          {!walletAddress ? (
            <button className="connect-metamask-btn" onClick={connectWallet}>
              <img src={metamaskLogo} alt="MetaMask" className="metamask-icon" />
              Connect MetaMask
            </button>
          ) : (
            <span className="wallet-connected">
              <img src={metamaskLogo} alt="MetaMask" className="metamask-icon" />
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          )}
        </div>
      </div>
      <div className="home-main" style={{ display: 'flex', flexDirection: 'row', gap: '3.5rem', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ width: 370, display: 'flex', flexDirection: 'column', gap: '2.2rem', alignItems: 'stretch' }}>
          <button
            className="action-btn invest-btn stylish-upload-btn"
            style={{
              width: '100%',
              borderRadius: 15,
              fontSize: '1.15rem',
              fontWeight: 700,
              padding: '1.3rem 0',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: '#1976d2',
              boxShadow: '0 4px 16px rgba(56,142,60,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.5px',
              transition: 'background 0.2s, color 0.2s',
            }}
            onClick={() => navigate('/uploadproject')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="22" height="22" fill="#1976d2" style={{ marginRight: 8 }} viewBox="0 0 24 24"><path d="M12 16v-8m0 0l-4 4m4-4l4 4" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="17" width="18" height="4" rx="2" fill="#e8f5e9"/></svg>
              Upload Project
            </span>
          </button>
          <div className="dashboard-card" style={{ width: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">Total Investment</h3>
            </div>
            <div className="card-value" key={dashboardData.totalInvestment}>{Number(dashboardData.totalInvestment).toFixed(4)} ETH</div>
            <p className="card-subtitle">Total raised across all projects</p>
          </div>
          <div className="dashboard-card" style={{ width: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">Active Projects</h3>
            </div>
            <div className="card-value" key={dashboardData.activeProjects}>{dashboardData.activeProjects}</div>
            <p className="card-subtitle">Projects currently live</p>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, alignSelf: 'stretch' }}>
          <div className="dashboard-card" style={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '2rem 2.5rem' }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '1.35rem', color: '#1976d2', letterSpacing: '0.5px' }}>Recent Investments</h3>
            </div>
            <ul className="investments-list" style={{ flex: 1, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
              {recentInvestments.length === 0 ? (
                <li style={{ color: '#888', padding: '1.5rem 0', textAlign: 'center' }}>No recent investments.</li>
              ) : (
                recentInvestments.map((inv, idx) => (
                  <li key={inv.txHash || idx} style={{
                    borderBottom: '1px solid #f0f0f0',
                    padding: '1.1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontWeight: 600, color: '#388e3c', fontSize: '1.08rem' }}>{inv.contributor}</span>
                      <small style={{ color: '#888', fontSize: '0.98rem' }}>{new Date(inv.timestamp).toLocaleString()}</small>
                    </div>
                    <span style={{ fontWeight: 700, color: '#1976d2', fontSize: '1.45rem', letterSpacing: '1px', minWidth: 100, textAlign: 'right' }}>{Number(inv.amount).toFixed(4)} ETH</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;