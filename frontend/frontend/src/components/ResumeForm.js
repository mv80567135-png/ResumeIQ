import React, { useRef } from "react";

function ResumeForm({
  file,
  setFile,
  jobType,
  setJobType,
  onSubmit,
  loading
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="form-card">
      <div className="form-group">
        <label htmlFor="job-type-select">Target Industry / Domain</label>
        <select
          id="job-type-select"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          disabled={loading}
        >
          <option value="IT">IT & Software Engineering</option>
          <option value="NON_IT">Non-IT (Finance, Accounts, Sales, Ops)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Upload Candidate Resume</label>
        <div
          className={`dropzone ${file ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={loading}
          />
          {file ? (
            <div className="file-preview">
              <span className="file-icon">📑</span>
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFile();
                }}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <span className="upload-icon">📤</span>
              <p className="primary-text">Click or drag & drop resume here</p>
              <p className="secondary-text">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
            </div>
          )}
        </div>
      </div>

      <button
        className={`submit-btn ${loading ? "loading" : ""}`}
        onClick={onSubmit}
        disabled={loading || !file}
      >
        {loading ? (
          <>
            <span className="spinner"></span> Analyzing Resume...
          </>
        ) : (
          "🔍 Analyze Resume"
        )}
      </button>
    </div>
  );
}

export default ResumeForm;
