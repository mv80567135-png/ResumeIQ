function Result({ result }) {

  if (!result) return null;

  return (
    <div>

      <h2>
        Match Score: {result.score}%
      </h2>

      <h3>Matched Skills</h3>

      <ul>
        {result.matched_skills.map(skill => (
          <li key={skill}>
            {skill}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Result;