import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useChannel } from "../components/AblyReactEffect";
import PlayersWidget from '../components/PlayersWidget'
import AnswerUnderReview from '../components/AnswerUnderReview'

export default function Host() {
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [peopleCount, setPeopleCount] = useState(0)
  const [gameId, setGameId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  let question

  const getQuestions = async (gameId) => {
    fetch('/api/game?' + new URLSearchParams({
      game: gameId
    })).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.length > 0) {
        setQuestions(data)
      }
    }).catch(error => {
      console.log(error);
    })
  }

  if (router.isReady && !gameId) {
    const { game } = router.query
    if (game) {
        setGameId(game)
        game ? getQuestions(game) : null
    } else {
        router.push({
            pathname: '/game'
        })
    }
  }

  const handleBeginGame = () => {
    setGameStarted(true)
  }

  const [channel, ably] = useChannel("bowdark-trivia", (answer) => {
    setAnswers([...answers, answer.data])
  });

  channel.presence.subscribe('enter', (event) => {
    let newCount = peopleCount + 1
    setPeopleCount(newCount)
  });

  channel.presence.subscribe('leave', (event) => {
    let newCount = peopleCount - 1
    setPeopleCount(newCount)
  });
  
  const handleNextQuestion = () => {
    channel.publish({ name: "next-question"});
    setAnswers([])
  }

  const handleAccept = (key) => {
    const correctAnswer = answers.splice(key, 1)
    channel.publish({ name: "correct-answer", data: correctAnswer });
  }
  
  const handleReject = (key) => {
    const answersClone = [...answers]
    const wrongAnswer = answersClone.splice(key, 1)
    setAnswers(answersClone)
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>
        {answers.length !== 0 ? (
            answers.map((answer, index) => {
                return (index === 0 ? <AnswerUnderReview answer={answer} key={index} onAccept={handleAccept} onReject={handleReject}/> : <div  key={index}>{answer}</div>)
            })
        ) : <p>No answers yet...</p>}
        <button className='btn btn-primary' onClick={handleNextQuestion}>Next Question</button>
      </Layout>
    </>
  )
}
