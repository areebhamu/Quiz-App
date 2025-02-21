import { useState } from "react";
import { openDB } from "idb";
import "./Result.scss";

const Result = ({ totalQuestions, result, onTryAgain, inputAttempts }) => {
  const [name, setName] = useState("");
  const [scores, setScores] = useState([]); // Store retrieved scores
  const [isSaved, setIsSaved] = useState(false); // Track save status


  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter your name before saving!");
      return;
    }

    const db = await openDB("quizDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("scores")) {
          db.createObjectStore("scores", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });

    const scoreData = {
      name: name,
      score: result.score,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      totalQuestions: totalQuestions,
      date: new Date().toISOString(),
    };

    await db.add("scores", scoreData);

    // Hide input & button, show success message
    setIsSaved(true);

    // show all saved data in the console
    const storedScores = await db.getAll("scores");
    console.log(storedScores);
  };

  return (
    <>
      <div className="result">
        <h3>Result</h3>
        <p>
          This is your: <span>{inputAttempts}</span> attempt.
        </p>
        <p>
          Total Questions: <span>{totalQuestions}</span>
        </p>
        <p>
          Total Score: <span>{result.score}</span>
        </p>
        <p>
          Correct Answer: <span>{result.correctAnswers}</span>
        </p>
        <p>
          Wrong Answer: <span>{result.wrongAnswers}</span>
        </p>
        <button onClick={onTryAgain}>Try Again</button>


        {!isSaved ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter Your Name to Save Your Result."
            />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
            <>
                <p className="success-message">✅ Your progress has been saved in the database!</p>
            </>
        )}
      </div>
    </>
  );
};

export default Result;
