import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

function Timer() {
  const {secondsRemaining, useTicker} = useQuiz();

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

 useTicker();

  return <div className='timer'>{mins<10 && 0}{mins}:{seconds<10 && 0}{seconds}</div>;
}

export default Timer;
