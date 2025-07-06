import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserHomePage from "./UserHomePage";
import AdminHomePage from "./AdminHomePage";
import AdminLoginPage from "./AdminLoginPage";
import UploadProjectPage from "./UploadProjectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/userhomepage" element={<UserHomePage />} />
        <Route path="/adminhomepage" element={<AdminHomePage />} />
        <Route path="/adminloginpage" element={<AdminLoginPage />} />
        <Route path="/uploadproject" element={<UploadProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
