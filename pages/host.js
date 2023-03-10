import Script from 'next/script'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
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
  const [isGameStarted, setIsGameStarted] = useState(false)

  //Refactor constants into single doc to import
  const IDENTIFIER_KEY = '__bt_id'


  useEffect(() => {
    if (router.isReady) {

      const { game } = router.query
      if (!gameId) {
        game ? setGameId(game) : router.push('/game')
      }
      
      let _localId = JSON.parse(localStorage.getItem(IDENTIFIER_KEY))

      const ably = configureAbly({ 
        authUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/createTokenRequest`,
        authMethod: 'POST',
        authParams: {
          clientId: _localId
        }
      })

      ably.connection.on((stateChange) => {
        console.log(stateChange)
      })

      const _channel = ably.channels.get(`trivia-channel-${game}`)

      _channel.subscribe('trivia-answer', (answer) => {
          setAnswers([...answers, answer])
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

      return () => {
        _channel.unsubscribe()
      }
    
    }

    if (!channel) {
      console.log(router.isReady);
      // router.replace('/host')
    }
  }, [answers, router, gameId, channel, peopleCount]) // Only run the client

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
    if (!isGameStarted) {
      setIsGameStarted(true)
    }
    console.log(`current question: ${currentQuestion}`);
    console.log(questions[currentQuestion]);
    channel.publish({ name: "next-question", data: questions[currentQuestion]});
    setCurrentQuestion(currentQuestion + 1)
    setAnswers([])
  }

  const handleAccept = () => {
    const correctAnswer = answers[0]
    channel.publish({ name: "correct-answer", data: correctAnswer });
  }
  

  //Change the Reject to update a boolean field whether the answer is correct or not, this way we can retain the indexes and the data

  const handleReject = () => {
    const answersClone = [...answers]
    const wrongAnswer = answersClone.splice(0, 1)
    setAnswers(answersClone)
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>
        <div className='h-[80vh] flex flex-col items-center'>
          <a target="_blank" rel="noopener noreferrer" href={`${process.env.NEXT_PUBLIC_HOST_URL}/game?game=${gameId}`}>Open Game View</a>
          {isGameStarted ?  <>
                            <button className='btn btn-primary my-5' onClick={handleNextQuestion}>Next Question</button>
                            <div className='flex flex-col-reverse items-center justify-start h-[65%]'>
                              {answers.length > 0 ? (
                                  answers.map((answer, index) => {
                                      // return(<div key={index}>{answer.data}</div>)
                                      console.log(index);
                                      return (index === 0 ? <AnswerUnderReview answer={answer.data} key={index} onAccept={handleAccept} onReject={handleReject}/> : <div className='opacity-50' key={index}>{answer.data}</div>)
                                  })
                              ) : <p>No answers yet...</p>}
                            </div>
                            </>
                          : <>
                              <button className='btn btn-primary my-5' onClick={handleNextQuestion}>Start Game</button>
                            </>}

          
        </div>
      </Layout>
    </>
  )
}
