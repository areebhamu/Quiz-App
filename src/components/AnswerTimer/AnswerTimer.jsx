import { useEffect, useState, useRef } from "react";
import "./AnswerTimer.scss";

function AnswerTimer({ duration, onTimeUp }) {
  const [timer, setTimer] = useState(duration);
  const [progressLoaded, setProgressLoaded] = useState(100);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    setProgressLoaded((timer / duration) * 100);

    if (timer <= 0) {  // Fix: Ensure timer expiration is correctly handled
      clearInterval(intervalRef.current);
      onTimeUp();
    }
  }, [timer, duration, onTimeUp]);

  return <div className="answer-timer">Time left: {timer}s</div>;
}

export default AnswerTimer;
