import React from "react";

function Result({ result }) {
  if (!result) return null;

  const score = result.score || 0;
  let scoreClass = "score-low";
  let statusText = "Needs Improvement";

  if (score >= 70) {
    scoreClass = "score-high";
    statusText = "Strong Match";
  } else if (score >= 40) {
    scoreClass = "score-mid";
    statusText = "Moderate Match";
  }

  return (
    <div className="result-card">
      <div className="result-header">
        <div>
          <h2>Analysis Result</h2>
          <p className="file-info">
            📄 <strong>{result.file_name || "Resume"}</strong> • {result.job_type} Domain
          </p>
        </div>
        <div className={`score-badge ${scoreClass}`}>
          <span className="score-num">{score}%</span>
          <span className="score-label">{statusText}</span>
        </div>
      </div>

      <div className="skills-grid">
        <div className="skills-column">
          <h3>
            <span className="icon success">✓</span> Matched Skills ({result.matched_skills?.length || 0})
          </h3>
          {result.matched_skills && result.matched_skills.length > 0 ? (
            <div className="tags-container">
              {result.matched_skills.map((skill) => (
                <span key={skill} className="skill-tag matched">
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No required skills were detected in the resume.</p>
          )}
        </div>

        <div className="skills-column">
          <h3>
            <span className="icon missing">✕</span> Missing Skills ({result.missing_skills?.length || 0})
          </h3>
          {result.missing_skills && result.missing_skills.length > 0 ? (
            <div className="tags-container">
              {result.missing_skills.map((skill) => (
                <span key={skill} className="skill-tag missing">
                  ✕ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-text">Outstanding! All required skills matched.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
