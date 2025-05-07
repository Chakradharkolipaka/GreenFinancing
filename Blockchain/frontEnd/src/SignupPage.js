import React, { useState } from "react";
import "./SignupPage.css";

function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    wallet: "",
    organization: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      const response = await fetch('/api/blockchain/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Account created successfully!");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      setError("Network error.");
    }
};

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your GreenFinancing Account</h2>
        {error && <div className="signup-error">{error}</div>}
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Wallet Address</label>
          <input
            name="wallet"
            type="text"
            value={form.wallet}
            onChange={handleChange}
            required
            placeholder="0x..."
          />
        </div>
        <div className="form-group">
          <label>Organization / Project Name (optional)</label>
          <input
            name="organization"
            type="text"
            value={form.organization}
            onChange={handleChange}
            placeholder="Your organization or project"
          />
        </div>
        <button type="submit" className="signup-btn">
          Create Account
        </button>
        <div className="login-link">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;