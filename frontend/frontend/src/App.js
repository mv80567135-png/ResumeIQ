import React, { useState, useEffect } from "react";
import "./App.css";
import ResumeForm from "./components/ResumeForm";
import Result from "./components/Result";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function App() {
  const [file, setFile] = useState(null);
  const [jobType, setJobType] = useState("IT");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.warn("Could not load history from backend:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearResult = () => {
    setResult(null);
    if (error) setError(null);
  };

  const handleAnalyzeResume = async () => {
    if (!file) {
      setError("Please select a resume file before analyzing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_type", jobType);

      const response = await fetch(`${API_BASE_URL}/screen/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setResult(data);
      fetchHistory(); // Refresh history with latest entry
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to Django backend server. Please verify backend is running at http://127.0.0.1:8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all screening history?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/history/clear/`, { method: "DELETE" });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="brand">
          <span className="brand-logo">📄</span>
          <div>
            <h1>ResumeIQ</h1>
            <p className="subtitle">AI & Intelligent Resume Screening System</p>
          </div>
        </div>

        <button
          className="history-toggle-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "✕ Close History" : `📜 History (${history.length})`}
        </button>
      </header>

      <main className="main-content">
        {error && (
          <div className="alert-error">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">{error}</div>
            <button className="alert-dismiss" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        <ResumeForm
          file={file}
          setFile={(f) => {
            setFile(f);
            setResult(null); // Clear previous result whenever a new file is chosen
            if (error) setError(null);
          }}
          jobType={jobType}
          setJobType={(jt) => {
            setJobType(jt);
            setResult(null); // Clear result if industry domain changes
          }}
          onSubmit={handleAnalyzeResume}
          loading={loading}
          onClearResult={handleClearResult}
        />

        {/* Only show result when BOTH a resume file is selected AND an analysis result exists */}
        {file && result && <Result result={result} />}

        {showHistory && (
          <div className="history-card">
            <div className="history-header">
              <h2>Recent Screenings</h2>
              {history.length > 0 && (
                <button className="clear-history-btn" onClick={handleClearHistory}>
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="empty-text">No screening records found yet.</p>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Domain</th>
                      <th>Score</th>
                      <th>Date & Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td className="cell-filename">{item.file_name || "Resume"}</td>
                        <td>
                          <span className="badge-domain">{item.job_type}</span>
                        </td>
                        <td>
                          <span
                            className={`badge-score ${
                              item.score >= 70
                                ? "high"
                                : item.score >= 40
                                ? "mid"
                                : "low"
                            }`}
                          >
                            {item.score}%
                          </span>
                        </td>
                        <td className="cell-date">{item.created_at}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => {
                              // Load the historical record and attach virtual file info
                              setFile({ name: item.file_name || "Resume.pdf", size: 0 });
                              setJobType(item.job_type === "Non-IT" ? "NON_IT" : "IT");
                              setResult(item);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>ResumeIQ • Automated Candidate Evaluation & Skill Extraction</p>
      </footer>
    </div>
  );
}

export default App;
