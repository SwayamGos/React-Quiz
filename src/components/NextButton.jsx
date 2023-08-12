import { useQuiz } from "../context/QuizContext";

function NextButton() {
  const {answer, index, numQuestions, progressQues, finishQuiz} = useQuiz();

  if (answer === null) return null;

  if (index < (numQuestions -1)) return (
    <button
      className='btn btn-ui'
      onClick={() => progressQues()}
    >
      Next
    </button>
  );

  if (index >= (numQuestions - 1))
    return (
      <button
        className='btn btn-ui'
        onClick={() => finishQuiz()}
      >
        Finish
      </button>
    );
}

export default NextButton;
