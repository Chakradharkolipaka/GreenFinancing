import React, { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import ContributeForm from "./components/ContributeForm";
import GetProjectDetails from "./components/GetProjectDetails";
import './HomePage.css';
import metamaskIcon from './assets/metamask.png';

const CONTRACT_ADDRESS = "0x3e9F8fAF19ea56DDc302eE7e6f2441C1f1127Adf";

function UserHomePage() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [recentInvestments, setRecentInvestments] = useState([]);
  const [showContribute, setShowContribute] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeCard, setActiveCard] = useState(null); // 'project', 'investments', 'activeProjects'
  const [modalType, setModalType] = useState(null); // 'project' | 'withdrawals' | 'recentInvestments'
  const [modalOpen, setModalOpen] = useState(false);
  const hoverTimeout = useRef(null);
  const [isModalHovered, setIsModalHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
    fetchRecentInvestments();
    fetchStats();
    fetchProjects();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/blockchain/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {}
  };

  const fetchStats = async () => {
    // Simulate stats: you may want to fetch from backend if available
    try {
      const invRes = await fetch('/api/blockchain/recent-investments');
      if (invRes.ok) {
        const invData = await invRes.json();
        setTotalInvestments(invData.length);
      }
      // For active projects, you may want to fetch from /add-project or similar
      // Here, we assume 1 active project for demo
      setActiveProjects(1);
    } catch (error) {}
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/blockchain/withdraw-reviews');
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data);
      }
    } catch (error) {}
  };

  const fetchRecentInvestments = async () => {
    try {
      const response = await fetch('/api/blockchain/recent-investments');
      if (response.ok) {
        const data = await response.json();
        setRecentInvestments(data);
      }
    } catch (error) {}
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

  // Helper functions for hover with delay
  const handleCardMouseEnter = (type) => {
    setIsCardHovered(true);
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setModalType(type);
      setModalOpen(true);
    }, 200); // 200ms delay before showing modal
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    hoverTimeout.current = setTimeout(() => {
      if (!isModalHovered) {
        setModalType(null);
        setModalOpen(false);
      }
    }, 200); // 200ms delay before hiding modal
  };

  const handleModalMouseEnter = () => {
    setIsModalHovered(true);
    clearTimeout(hoverTimeout.current);
  };

  const handleModalMouseLeave = () => {
    setIsModalHovered(false);
    hoverTimeout.current = setTimeout(() => {
      if (!isCardHovered) {
        setModalType(null);
        setModalOpen(false);
      }
    }, 200);
  };

  return (
    <div className="home-container">
      {/* User info icon top right */}
      <div style={{ position: 'absolute', top: 18, right: 32, zIndex: 30 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#1976d2',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.25rem',
            cursor: 'pointer',
            border: '2px solid #1976d2',
            userSelect: 'none',
          }}
          onClick={() => setShowUserInfo(v => !v)}
          onMouseEnter={() => setShowUserInfo(true)}
          onMouseLeave={() => setShowUserInfo(false)}
        >
          {user && (user.username ? user.username[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U'))}
        </div>
        {showUserInfo && user && (
          <div style={{ position: 'absolute', top: 48, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1rem 1.5rem', minWidth: 220, zIndex: 40 }}>
            <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>{user.username || user.email}</div>
            <div style={{ fontSize: '0.98rem', color: '#555' }}><b>Email:</b> {user.email}</div>
            <div style={{ fontSize: '0.98rem', color: '#555' }}><b>Wallet:</b> {user.wallet || walletAddress}</div>
          </div>
        )}
      </div>
      {/* Welcome message */}
      {user && showWelcome && (
        <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '0.85rem 1.5rem', borderRadius: 8, margin: '1.5rem 0 0.5rem 0', fontWeight: 500, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Welcome, {user.username || user.email || 'User'}!</span>
          <button style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setShowWelcome(false)}>&times;</button>
        </div>
      )}
      {/* Navbar */}
      <div className="home-header" style={{ position: 'relative' }}>
        <h1>GreenFinancing User Dashboard</h1>
        <nav className="blockchain-actions-nav">
          <button className="nav-action-btn contribute-btn" onClick={() => setShowContribute(true)}>Contribute</button>
          <button className="nav-action-btn details-btn" onClick={() => setShowProjectDetails(true)}>Project Details</button>
        </nav>
      </div>
      {/* Connect MetaMask row below navbar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '1.2rem 0 2rem 0' }}>
        <button className="connect-metamask-btn" onClick={connectWallet} style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: '1.08rem', padding: '0.7rem 1.5rem', borderRadius: 8, border: '1.5px solid #1976d2', background: '#fff', color: '#1976d2', boxShadow: '0 2px 8px rgba(25,118,210,0.07)' }}>
          <img src={metamaskIcon} alt="MetaMask" style={{ width: 28, height: 28 }} />
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect MetaMask'}
        </button>
      </div>
      {/* Main content row */}
      <div className="home-main" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', width: '100%' }}>
        {/* Project Details Card */}
        <div
          className="dashboard-card"
          style={{
            flex: 1,
            minWidth: 180,
            background: '#f5f6fa',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: activeCard === 'project' ? '0 4px 24px rgba(25,118,210,0.13)' : '0 2px 8px rgba(25,118,210,0.07)',
            cursor: 'pointer',
            border: '1.5px solid #e3eafc',
            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
            transform: activeCard === 'project' ? 'scale(1.045)' : 'scale(1)',
            outline: activeCard === 'project' ? '2.5px solid #1976d2' : 'none',
            outlineOffset: activeCard === 'project' ? '2px' : '0',
          }}
          onMouseEnter={() => { setActiveCard('project'); handleCardMouseEnter('project'); }}
          onMouseLeave={() => { setActiveCard(null); handleCardMouseLeave(); }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1976d2' }}>Project Overview</div>
        </div>
        {/* Total Investments Card */}
        <div
          className="dashboard-card"
          style={{
            flex: 1,
            minWidth: 180,
            background: '#f5f6fa',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: activeCard === 'investments' ? '0 4px 24px rgba(25,118,210,0.13)' : '0 2px 8px rgba(25,118,210,0.07)',
            cursor: 'pointer',
            border: '1.5px solid #e3eafc',
            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
            transform: activeCard === 'investments' ? 'scale(1.045)' : 'scale(1)',
            outline: activeCard === 'investments' ? '2.5px solid #1976d2' : 'none',
            outlineOffset: activeCard === 'investments' ? '2px' : '0',
          }}
          onMouseEnter={() => handleCardMouseEnter('investments')}
          onMouseLeave={handleCardMouseLeave}
        >
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1976d2' }}>Total Investments</div>
          <div style={{ marginTop: 12, fontWeight: 800, fontSize: '2.1rem', color: '#388e3c' }}>{totalInvestments}</div>
        </div>
        {/* Active Projects Card */}
        <div
          className="dashboard-card"
          style={{
            flex: 1,
            minWidth: 180,
            background: '#f5f6fa',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: activeCard === 'activeProjects' ? '0 4px 24px rgba(25,118,210,0.13)' : '0 2px 8px rgba(25,118,210,0.07)',
            cursor: 'pointer',
            border: '1.5px solid #e3eafc',
            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
            transform: activeCard === 'activeProjects' ? 'scale(1.045)' : 'scale(1)',
            outline: activeCard === 'activeProjects' ? '2.5px solid #1976d2' : 'none',
            outlineOffset: activeCard === 'activeProjects' ? '2px' : '0',
          }}
          onMouseEnter={() => handleCardMouseEnter('activeProjects')}
          onMouseLeave={handleCardMouseLeave}
        >
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1976d2' }}>Active Projects</div>
          <div style={{ marginTop: 12, fontWeight: 800, fontSize: '2.1rem', color: '#388e3c' }}>{activeProjects}</div>
          <div style={{ marginTop: 8 }}>
            <ul style={{ paddingLeft: 0, listStyle: 'none', fontSize: '0.98rem', color: '#1976d2', maxHeight: 120, overflowY: 'auto' }}>
              {projects.slice(0, 5).map((proj, idx) => (
                <li key={proj._id || idx} style={{ marginBottom: 4 }}>
                  {proj.name || 'Unnamed Project'}
                </li>
              ))}
              {projects.length === 0 && <li style={{ color: '#888' }}>No active projects.</li>}
            </ul>
          </div>
        </div>
        {/* Admin Withdrawals Card */}
        <div
          className="dashboard-card"
          style={{
            flex: 1,
            minWidth: 180,
            background: '#f5f6fa',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: activeCard === 'withdrawals' ? '0 4px 24px rgba(25,118,210,0.13)' : '0 2px 8px rgba(25,118,210,0.07)',
            cursor: 'pointer',
            border: '1.5px solid #e3eafc',
            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
            transform: activeCard === 'withdrawals' ? 'scale(1.045)' : 'scale(1)',
            outline: activeCard === 'withdrawals' ? '2.5px solid #1976d2' : 'none',
            outlineOffset: activeCard === 'withdrawals' ? '2px' : '0',
          }}
          onMouseEnter={() => { setActiveCard('withdrawals'); handleCardMouseEnter('withdrawals'); }}
          onMouseLeave={() => { setActiveCard(null); handleCardMouseLeave(); }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1976d2' }}>Admin Withdrawals</div>
        </div>
        {/* Recent Investments Card */}
        <div
          className="dashboard-card"
          style={{
            flex: 1,
            minWidth: 180,
            background: '#f5f6fa',
            borderRadius: 12,
            padding: '1.5rem',
            boxShadow: activeCard === 'recentInvestments' ? '0 4px 24px rgba(25,118,210,0.13)' : '0 2px 8px rgba(25,118,210,0.07)',
            cursor: 'pointer',
            border: '1.5px solid #e3eafc',
            transition: 'box-shadow 0.2s, transform 0.2s, border 0.2s',
            transform: activeCard === 'recentInvestments' ? 'scale(1.045)' : 'scale(1)',
            outline: activeCard === 'recentInvestments' ? '2.5px solid #1976d2' : 'none',
            outlineOffset: activeCard === 'recentInvestments' ? '2px' : '0',
          }}
          onMouseEnter={() => { setActiveCard('recentInvestments'); handleCardMouseEnter('recentInvestments'); }}
          onMouseLeave={() => { setActiveCard(null); handleCardMouseLeave(); }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1976d2' }}>Recent Investments</div>
        </div>
      </div>
      {/* Hover Modals */}
      {modalOpen && modalType === 'project' && (
        <div className="modal-overlay" style={{ pointerEvents: 'none' }} onMouseEnter={handleModalMouseEnter} onMouseLeave={handleModalMouseLeave}>
          <div className="modal-content" style={{ pointerEvents: 'auto' }}>
            <h2>Project Details</h2>
            {projects.length === 0 ? (
              <div>No project data available.</div>
            ) : (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {projects.map((proj, idx) => (
                  <div key={proj._id || idx} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '1rem 1.5rem', marginBottom: 18, background: '#fafbfc' }}>
                    <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                      {Object.entries(proj).map(([key, value]) => (
                        key !== '__v' && key !== '_id' && (
                          <li key={key}><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {String(value)}</li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {modalOpen && modalType === 'withdrawals' && (
        <div className="modal-overlay" style={{ pointerEvents: 'none' }} onMouseEnter={handleModalMouseEnter} onMouseLeave={handleModalMouseLeave}>
          <div className="modal-content" style={{ pointerEvents: 'auto' }}>
            <h2>Admin Withdrawals</h2>
            <ul className="withdrawals-list" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {withdrawals.length === 0 ? (
                <li style={{ color: '#888', padding: '1.5rem 0', textAlign: 'center' }}>No withdrawals yet.</li>
              ) : (
                withdrawals.map((w, idx) => (
                  <li key={w.txHash || idx} style={{ borderBottom: '1px solid #f0f0f0', padding: '1.1rem 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span><b>Amount:</b> {w.amount} ETH</span>
                    <span><b>Receiver:</b> {w.receiver}</span>
                    <span><b>Admin:</b> {w.admin}</span>
                    <span><b>Review:</b> {w.review}</span>
                    <span><b>TxHash:</b> <a href={`https://sepolia.etherscan.io/tx/${w.txHash}`} target="_blank" rel="noopener noreferrer">{w.txHash.slice(0, 10)}...</a></span>
                    <span><b>Date:</b> {new Date(w.timestamp).toLocaleString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
      {modalOpen && modalType === 'recentInvestments' && (
        <div className="modal-overlay" style={{ pointerEvents: 'none' }} onMouseEnter={handleModalMouseEnter} onMouseLeave={handleModalMouseLeave}>
          <div className="modal-content" style={{ pointerEvents: 'auto' }}>
            <h2>Recent Investments</h2>
            <ul className="investments-list" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {recentInvestments.length === 0 ? (
                <li style={{ color: '#888', padding: '1.5rem 0', textAlign: 'center' }}>No recent investments.</li>
              ) : (
                recentInvestments.map((inv, idx) => (
                  <li key={inv.txHash || idx} style={{ borderBottom: '1px solid #f0f0f0', padding: '1.1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
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
      )}
      {/* Project Details Modal */}
      {showProjectDetails && (
        <div className="modal-overlay" onClick={() => setShowProjectDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <GetProjectDetails 
              contractAddress={CONTRACT_ADDRESS}
              provider={provider}
              onClose={() => setShowProjectDetails(false)}
            />
          </div>
        </div>
      )}
      {/* Contribute Modal */}
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
  );
}

export default UserHomePage;
