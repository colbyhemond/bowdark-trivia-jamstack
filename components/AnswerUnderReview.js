import { useState } from "react"


const AnswerUnderReview = ({answer, key, onAccept, onReject}) => {

    const handleAccept = () => {
        onAccept(key)
    }

    const handleReject = () => {
        onReject(key)
    }

    return (<>
        <div className="flex items-center gap-5"  key={key}>
            <button className="btn btn-error" onClick={handleReject}>Wrong</button>
            <span>{answer}</span>
            <button className="btn btn-success" onClick={handleAccept}>Correct</button>
        </div>
    </>)

}

export default AnswerUnderReview