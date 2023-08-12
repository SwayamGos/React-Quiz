import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: Number(localStorage.getItem("highscore")) ?? 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    default:
      throw new Error("Unknown Action");
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished": {
      if (state.highscore > state.points) {
        localStorage.setItem("highscore", JSON.stringify(state.highscore));
      } else {
        localStorage.setItem("highscore", JSON.stringify(state.points));
      }
      return {
        ...state,
        status: "finished",
        highscore:
          state.highscore > state.points ? state.highscore : state.points,
      };
    }
    case "reset": {
      return { ...initialState, questions: state.questions, status: "ready" };
    }
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
  }
}

export function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  function fetchQuestions() {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((err) => dispatch({ type: "dataFailed" }));
    // console.log(questions);
  }

  function startQuiz() {
    dispatch({ type: "start" });
  }

  function selectAns (index) {
    dispatch({ type: "newAnswer", payload: index });
  }

  function useTicker() {
    useEffect(
      function () {
        const id = setInterval(function () {
          dispatch({ type: "tick" });
        }, 1000);

        return () => clearInterval(id);
      },
      [dispatch]
    );
  }

  function progressQues() {
    dispatch({ type: "nextQuestion" });
  }

  function finishQuiz() {
    dispatch({ type: "finished" });
  }

  function resetQuiz() {
    dispatch({ type: "reset" });
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        fetchQuestions,
        startQuiz,
        numQuestions,
        maxPoints,
        selectAns,
        useTicker,
        progressQues,
        finishQuiz,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const quiz = useContext(QuizContext);
  if (quiz === undefined) throw new Error("Used outside");
  return quiz;
}
