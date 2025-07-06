import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch('/api/blockchain/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username, // assuming username is email
          password,
          wallet,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful! Welcome, " + data.user.username);
        navigate("/userhomepage");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign in to Blockchain Portal</h2>
        {error && <div className="signup-error">{error}</div>}
        <div className="form-group">
          <label>Email address</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Wallet Address</label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            required
            placeholder="0x..."
          />
        </div>
        <button type="submit" className="login-btn">
          Sign in
        </button>
        <div className="signup-link">
          New to Blockchain Portal? <a href="/signup">Create an account</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;