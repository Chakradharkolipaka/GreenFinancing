import React from "react";
import UploadProjectForm from "./components/UploadProjectForm";

export default function UploadProjectPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%', background: 'white', borderRadius: 18, boxShadow: '0 8px 32px rgba(56,142,60,0.12)', padding: '2.5rem 2.5rem 2rem 2.5rem', margin: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Upload New Project</h2>
        <UploadProjectForm />
      </div>
    </div>
  );
}
