import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/blockchain/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Admin login successful!");
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/adminhomepage"); // Ensure this matches the route for AdminHomePage.js
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Sign In</h2>
        <div className="form-group">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <div style={{ color: '#b71c1c', textAlign: 'center', fontSize: '0.98rem' }}>{error}</div>}
        <button className="admin-login-btn" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="admin-signup-link">
          Not an admin? <a href="/login">User Sign In</a>
        </div>
      </form>
    </div>
  );
}

export default AdminLoginPage;
