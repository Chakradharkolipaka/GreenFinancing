import React, { useEffect, useState } from "react";

function HomePage({ onProjectDetailsChange }) {
  const [dashboardData, setDashboardData] = useState({
    totalInvestment: 0,
    activeProjects: 0,
    investments: [],
    milestones: [],
    esgScore: 0,
    carbonCredits: 0,
    projectStarted: false,
    owner: "",
    projectCost: 0,
    fundsAllocated: 0,
    // add more fields as needed
  });

  // Fetch project details from backend
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/blockchain/projectDetails');
      if (response.ok) {
        const data = await response.json();
        console.log("API data:", data); // <-- Add this line
        setDashboardData(prev => ({
          ...prev,
          totalInvestment: Number(data.totalFundsRaised) / 1e18,
          activeProjects: data.projectStarted ? 1 : 0
        }));
        if (onProjectDetailsChange) onProjectDetailsChange();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Call this after every blockchain action to refresh data
  const handleActionComplete = () => {
    fetchDashboardData();
    if (onProjectDetailsChange) onProjectDetailsChange();
  };

  // Pass handleActionComplete to your action components as a prop
  // Example: <ContributeForm onActionComplete={handleActionComplete} />

  // ...rest of your HomePage code...
}

export default HomePage;