import { useState } from "react";
import { resultInitialState } from "../../Questions";
import "./Quiz.scss";
import AnswerTimer from "../AnswerTimer/AnswerTimer";
import Result from "../Result/Result";

function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { question, choices, correctAnswer, type } = questions[currentQuestion];
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [inputAnswer, setInputAnswer] = useState("");
  const [inputAttempts, setInputAttempts] = useState(1);

  const onAnswerClick = (answer, index) => {
    setAnswerIdx(index);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer) => {
    setAnswerIdx(null);
    setInputAnswer("");
    setShowAnswerTimer(false);
    setResult((prev) =>
      finalAnswer
        ? {
            ...prev,
            score: prev.score + 1,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
      setShowResult(true);
    }

    setTimeout(() => {
      setShowAnswerTimer(true);
    });
  };

  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
    setInputAttempts((prev) => prev + 1 );
  };

  const handleTimeUp = () => {
    setAnswer(false);

    // Ensure that we move to the next question instead of jumping to results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswerIdx(null);
      setShowAnswerTimer(false);

      setTimeout(() => {
        setShowAnswerTimer(true);
      }, 1);
    } else {
      setShowResult(true); // Show results only after the last question
    }
  };

  const handleInputChange = (event) => {
    setInputAnswer(event.target.value);
    if (event.target.value === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const getAnswerUI = (type) => {
    if (type === "Integer-Type") {
      return <input value={inputAnswer} onChange={handleInputChange} />;
    }
    return (
      <ul>
        {choices.map((choice, index) => (
          <li
            onClick={() => onAnswerClick(choice, index)}
            key={choice}
            className={answerIdx === index ? "selected-answer" : null}
          >
            {choice}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          {showAnswerTimer && (
            <AnswerTimer duration={30} onTimeUp={handleTimeUp} />
          )}
          <span className="active-question-no">{currentQuestion + 1}</span>
          <span className="total-question"> of {questions.length}</span>
          <h2>{question}</h2>
          {getAnswerUI(type)}
          <div className="footer-integer-type">
            <button
              onClick={() => onClickNext(answer)}
              disabled={
                type === "Integer-Type"
                  ? inputAnswer.trim() === ""
                  : answerIdx === null
              }
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <Result 
          result={result} 
          onTryAgain={onTryAgain } 
          totalQuestions={questions.length}
          inputAttempts={inputAttempts} 
        />
      )}
    </div>
  );
};

export default Quiz;
