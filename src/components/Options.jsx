import { useQuiz } from "../context/QuizContext";

function Options() {
  const {questions, index, answer,selectAns} = useQuiz();
  const question= questions[index];
  const hasAnswered = answer != null;

  return (
    <div className='options'>
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          onClick={() => selectAns(index)}
          disabled={answer != null}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
