// import { useState } from "react";


// import ResumeForm from "./components/ResumeForm";
// import Result from "./components/Result";

// function App() {

//   const [result, setResult] = useState(null);

//   return (
//     <div>

//       <h1>
//         AI Resume Screening System
//       </h1>

//       <ResumeForm
//         setResult={setResult}
//       />

//       <Result
//         result={result}
//       />

//     </div>
//   );
// }

// export default App;

// src/App.js

import "./App.css";
import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [jobType, setJobType] = useState("IT");
  const [file, setFile] = useState(null);

  const submitResume = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("resume", file);
      formData.append("job_type", jobType);

      const response = await fetch(
        "http://127.0.0.1:8000/api/screen/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div className="container">
      <div className="logo">📄</div>

      <h1>ResumeIQ</h1>

      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      >
        <option value="IT">IT</option>
        <option value="NON_IT">Non-IT</option>
      </select>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={submitResume}>
        Analyze Resume
      </button>

      {result && (
        <div className="result-card">
          <h2>Resume Analysis</h2>

          <p>
            <strong>Job Type:</strong> {result.job_type}
          </p>

          <div className="score">
            {result.score}%
          </div>

          <h3>Matched Skills</h3>

          <ul className="skills">
            {result.matched_skills.map((skill) => (
              <li key={skill}>
                ✓ {skill}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;