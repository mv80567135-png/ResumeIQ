// import { useState } from "react";

// function ResumeForm({ setResult }) {

//   const [resume, setResume] = useState("");

//   const submitResume = async () => {

//     const response = await fetch(
//       "http://127.0.0.1:8000/api/screen/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           resume
//         })
//       }
//     );

//     const data = await response.json();

//     setResult(data);
//   };

//   return (
//     <div>
//       <textarea
//         rows="10"
//         cols="50"
//         placeholder="Paste Resume Here"
//         value={resume}
//         onChange={(e) =>
//           setResume(e.target.value)
//         }
//       />

//       <br />

//       <button onClick={submitResume}>
//         Analyze Resume
//       </button>
//     </div>
//   );
// }

// export default ResumeForm;


// import { useState } from "react";

// function ResumeUpload() {

//   const [file, setFile] = useState(null);
//   const [jobType, setJobType] = useState("IT");

//   const submitResume = async () => {

//     const formData = new FormData();

//     formData.append("resume", file);
//     formData.append("job_type", jobType);

//     const response = await fetch(
//       "http://127.0.0.1:8000/api/screen/",
//       {
//         method: "POST",
//         body: formData
//       }
//     );

//     const data = await response.json();

//     console.log(data);
//   };

//   return (
//     <div>

//       <h1>AI Resume Screening</h1>

//       <select
//         onChange={(e) =>
//           setJobType(e.target.value)
//         }
//       >
//         <option value="IT">IT</option>
//         <option value="NON_IT">
//           Non-IT
//         </option>
//       </select>

//       <br /><br />

//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={(e) =>
//           setFile(e.target.files[0])
//         }
//       />

//       <br /><br />

//       <button onClick={submitResume}>
//         Analyze Resume
//       </button>

//     </div>
//   );
// }

// export default ResumeUpload;


import { useState } from "react";

function ResumeUpload() {

  const [file, setFile] = useState(null);
  const [jobType, setJobType] = useState("IT");
  const [result, setResult] = useState(null);

  const submitResume = async () => {

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("job_type", jobType);

    const response = await fetch(
      "http://127.0.0.1:8000/api/screen/",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    setResult(data);   // Store result
  };

  return (
    <div>
      <h1>AI Resume Screening</h1>

      <select onChange={(e) => setJobType(e.target.value)}>
        <option value="IT">IT</option>
        <option value="NON_IT">Non-IT</option>
      </select>

      <br /><br />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={submitResume}>
        Analyze Resume
      </button>

      {/* Output Display */}
      {result && (
        <div style={{marginTop: "20px"}}>
          <h2>Resume Analysis Result</h2>

          <p>
            <strong>Job Type:</strong> {result.job_type}
          </p>

          <p>
            <strong>Match Score:</strong> {result.score}%
          </p>

          <h3>Matched Skills</h3>

          <ul>
            {result.matched_skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;