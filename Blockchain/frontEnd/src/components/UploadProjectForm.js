import React, { useState } from "react";
import "./UploadProjectForm.css";

function UploadProjectForm({ onProjectAdded }) {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    description: "",
    urls: [""],
    location: "",
    startDate: "",
    endDate: "",
    projectType: "",
    budget: "",
    team: "",
    impact: "",
    esgScore: "",
    carbonCredits: "",
    additionalInfo: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUrlChange = (idx, value) => {
    const urls = [...form.urls];
    urls[idx] = value;
    setForm({ ...form, urls });
  };

  const addUrlField = () => {
    setForm({ ...form, urls: [...form.urls, ""] });
  };

  const removeUrlField = idx => {
    if (form.urls.length === 1) return;
    setForm({ ...form, urls: form.urls.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/blockchain/add-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSubmitting(false);
    if (res.ok) {
      onProjectAdded && onProjectAdded();
      window.close();
    } else {
      alert("Failed to upload project");
    }
  };

  return (
    <form className="upload-project-form custom-upload-project-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Upload Project Data</h2>
      <div className="form-group"><label>Project Name</label><input name="name" value={form.name} onChange={handleChange} required /></div>
      <div className="form-group"><label>Owner</label><input name="owner" value={form.owner} onChange={handleChange} required /></div>
      <div className="form-group"><label>Location</label><input name="location" value={form.location} onChange={handleChange} required /></div>
      <div className="form-group"><label>Start Date</label><input name="startDate" type="date" value={form.startDate} onChange={handleChange} required /></div>
      <div className="form-group"><label>End Date</label><input name="endDate" type="date" value={form.endDate} onChange={handleChange} /></div>
      <div className="form-group"><label>Project Type</label><input name="projectType" value={form.projectType} onChange={handleChange} /></div>
      <div className="form-group"><label>Budget (ETH)</label><input name="budget" type="number" min="0" step="0.01" value={form.budget} onChange={handleChange} /></div>
      <div className="form-group"><label>Team</label><input name="team" value={form.team} onChange={handleChange} /></div>
      <div className="form-group"><label>Impact</label><textarea name="impact" value={form.impact} onChange={handleChange} /></div>
      <div className="form-group"><label>ESG Score</label><input name="esgScore" value={form.esgScore} onChange={handleChange} /></div>
      <div className="form-group"><label>Carbon Credits</label><input name="carbonCredits" value={form.carbonCredits} onChange={handleChange} /></div>
      <div className="form-group"><label>Additional Info</label><textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange} /></div>
      <div className="form-group"><label>Project URLs</label>
        {form.urls.map((url, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <input
              name={`url${idx}`}
              value={url}
              onChange={e => handleUrlChange(idx, e.target.value)}
              placeholder="Project URL"
              style={{ flex: 1 }}
              required={idx === 0}
            />
            {form.urls.length > 1 && (
              <button type="button" className="remove-url-btn" onClick={() => removeUrlField(idx)} title="Remove URL">&times;</button>
            )}
          </div>
        ))}
        <button type="button" className="add-url-btn" onClick={addUrlField}>+ Add URL</button>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>{submitting ? "Uploading..." : "Upload"}</button>
        <button type="button" onClick={() => window.close()}>Cancel</button>
      </div>
    </form>
  );
}

export default UploadProjectForm;