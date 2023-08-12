import { useQuiz } from "../context/QuizContext"
import Options from "./Options"

function Question() {
    const {questions, index, dispatch, answer} = useQuiz()

    return (
        <div>
            <h4>{questions[index].question}</h4>

            <Options />
        </div>
    )
}

export default Question
