import Script from 'next/script'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useChannel } from "../components/AblyReactEffect";
import AnswerUnderReview from '../components/AnswerUnderReview'
import { configureAbly } from '@ably-labs/react-hooks'

export default function Host() {
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [peopleCount, setPeopleCount] = useState(0)
  const [gameId, setGameId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [channel, setChannel] = useState(null)

  useEffect(() => {
    const ably = configureAbly({ authUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/createTokenRequest` })

    ably.connection.on((stateChange) => {
      console.log(stateChange)
    })

    const _channel = ably.channels.get('bowdark-trivia') //@TODO: change bowdark-trivia to the generated gameId once finialized

    _channel.subscribe('trivia-answer', (answer) => {
        console.log(answers);
        setAnswers(answers.concat(answer))
    })

    _channel.presence.subscribe('enter', (event) => {
      let newCount = peopleCount + 1
      setPeopleCount(newCount)
    });
  
    _channel.presence.subscribe('leave', (event) => {
      let newCount = peopleCount - 1
      setPeopleCount(newCount)
    });

    setChannel(_channel)

    console.log(answers);

    return () => {
      _channel.unsubscribe()
    }
  }, []) // Only run the client

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
  
  const handleNextQuestion = () => {
    channel.publish({ name: "next-question"});
    setAnswers([])
  }

  // const handleAccept = (key) => {
  //   const correctAnswer = answers.splice(key, 1)
  //   channel.publish({ name: "correct-answer", data: correctAnswer });
  // }
  

  // Change the Reject to update a boolean field whether the answer is correct or not, this way we can retain the indexes and the data

  // const handleReject = (key) => {
  //   const answersClone = [...answers]
  //   const wrongAnswer = answersClone.splice(key, 1)
  //   setAnswers(answersClone)
  // }

  console.log(answers);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>
        {answers.length > 0 ? (
            answers.map((answer, index) => {
                return(<div key={index}>{answer.data}</div>)
                // return (index === 0 ? <AnswerUnderReview answer={answer.data} key={index} onAccept={handleAccept} onReject={handleReject}/> : <div  key={index}>{answer.data}</div>)
            })
        ) : <p>No answers yet...</p>}
        <button className='btn btn-primary' onClick={handleNextQuestion}>Next Question</button>
      </Layout>
    </>
  )
}
