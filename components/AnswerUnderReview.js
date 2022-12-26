import { useState } from "react"


const AnswerUnderReview = ({answer, key, onAccept, onReject}) => {

    const handleAccept = () => {
        onAccept(key)
    }

    const handleReject = () => {
        onReject(key)
    }

    console.log(key);

    return (<>
        <div className="flex items-center gap-5 mt-10"  key={key}>
            <button className="btn btn-error" onClick={handleReject}>Wrong</button>
            <span className="text-xl font-bold">{answer}</span>
            <button className="btn btn-success" onClick={handleAccept}>Correct</button>
        </div>
    </>)

}

export default AnswerUnderReview