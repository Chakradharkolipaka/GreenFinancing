import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

// Use local SVG for hero image
import heroImg from "./assets/hero.png";
import featureToken from "./assets/token.svg";
import featureSmart from "./assets/contract.svg";
import featureESG from "./assets/analytics.svg";
import featureWallet from "./assets/wallet.svg";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeout = useRef();

  // Dropdown handlers
  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => setShowDropdown(true), 180);
  };
  const handleDropdownLeave = () => {
    clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => setShowDropdown(false), 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/blockchain/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username, // or use a separate email state if you have one
          password,
          wallet,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful! Welcome, " + data.user.username);
        // Optionally, redirect or update state here
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={heroImg} alt="GreenFinancing" className="logo-img" />
          GreenFinancing
        </div>
        <nav>
          <button className="nav-btn" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>Home</button>
          <button className="nav-btn" onClick={() => document.getElementById("about").scrollIntoView({behavior: "smooth"})}>About</button>
          <button className="nav-btn" onClick={() => document.getElementById("features").scrollIntoView({behavior: "smooth"})}>Features</button>
          <button className="nav-btn" onClick={() => document.getElementById("contact").scrollIntoView({behavior: "smooth"})}>Contact</button>
          <div
            className="signin-dropdown-wrapper"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
            tabIndex={0}
            onFocus={handleDropdownEnter}
            onBlur={handleDropdownLeave}
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              className="sign-in-btn"
              onClick={() => setShowDropdown((v) => !v)}
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              Sign In
            </button>
            {showDropdown && (
              <div className="signin-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/login");
                  }}
                >
                  User Sign In
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/adminloginpage");
                  }}
                >
                  Admin Sign In
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>
              Transforming Green Finance with <span className="gradient-text">Blockchain</span>
            </h1>
            <p>
              Empowering investors, developers, and regulators through transparent, automated, and impactful green financing. Track real-world sustainability, invest in tokenized projects, and ensure ESG compliance—all in one platform.
            </p>
            <div className="hero-btns">
              <button className="cta-btn" onClick={() => navigate("/signup")}>
                Get Started
              </button>
              <button className="cta-btn secondary" onClick={() => document.getElementById("about").scrollIntoView({behavior: "smooth"})}>
                Learn More
              </button>
            </div>
          </div>
          <img src={heroImg} alt="Green Blockchain Illustration" className="hero-img" />
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <h2>About GreenFinancing</h2>
          <p>
            GreenFinancing is a next-generation platform designed to revolutionize sustainable investment. Leveraging Polygon blockchain, AI, IoT, and smart contracts, we ensure every green project is transparent, efficient, and truly impactful. Our mission is to eliminate greenwashing, reduce administrative costs, and open green finance to all—delivering real, measurable ESG outcomes.
          </p>
          <div className="about-img-row">
            <img src={featureESG} alt="ESG Tracking" />
            <img src={featureSmart} alt="Smart Contracts" />
            <img src={featureToken} alt="Tokenization" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <h2>Platform Features</h2>
          <div className="features-list">
            <div className="feature-card">
              <img src={featureToken} alt="Tokenization" />
              <h3>Project Tokenization</h3>
              <p>
                Convert green projects into secure digital assets. Enable fractional ownership, instant liquidity, and global investment in renewable energy, carbon credits, and more.
              </p>
            </div>
            <div className="feature-card">
              <img src={featureSmart} alt="Smart Contracts" />
              <h3>Automated Smart Contracts</h3>
              <p>
                Funds are released only when projects meet verified ESG milestones. No intermediaries, no delays—just trustless, automated transactions.
              </p>
            </div>
            <div className="feature-card">
              <img src={featureESG} alt="ESG Data" />
              <h3>Real-Time ESG Data</h3>
              <p>
                Integrate IoT sensors and AI analytics for live tracking of environmental impact. All data is recorded immutably on-chain and visualized in investor dashboards.
              </p>
            </div>
            <div className="feature-card">
              <img src={featureWallet} alt="Wallet Integration" />
              <h3>Secure Wallet Integration</h3>
              <p>
                Connect MetaMask or WalletConnect for seamless onboarding, token custody, and participation—whether you’re an individual or institution.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-row">
            <form className="contact-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
              />
              <input 
                type="password" 
                placeholder="Your Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Your Wallet Address" 
                value={wallet} 
                onChange={(e) => setWallet(e.target.value)} 
                required 
              />
              <textarea placeholder="Your Message" rows={4} required />
              <button type="submit" className="cta-btn">Send Message</button>
            </form>
            <div className="contact-info">
              <h4>Get in Touch</h4>
              <p>
                <strong>Email:</strong> support@greenfinancing.org<br />
                <strong>Address:</strong> Trendz Utility, 3rd Floor, Gafoor Nagar, Vittal Rao Nagar Road, Madhapur, Hyderabad, TS – 500081. You
              </p>
              <img src={featureWallet} alt="Contact Illustration" className="contact-img"/>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} GreenFinancing. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;