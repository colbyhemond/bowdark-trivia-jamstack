import Script from 'next/script'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import PlayersWidget from '../components/PlayersWidget'
import SVGCanvas from '../components/SVGCanvas'
import { configureAbly } from '@ably-labs/react-hooks'

export default function Game() {
  const router = useRouter()

  const [question, setQuestion] = useState(undefined)
  const [answers, setAnswers] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(undefined)
  const [gameStarted, setGameStarted] = useState(false)
  const [peopleCount, setPeopleCount] = useState(undefined)
  const [gameId, setGameId] = useState('')
  const [people, setPeople] = useState([])
  const [channel, setChannel] = useState(null)
  let _gameId
  
  const setPeopleInfo = (channel) => {
    channel.presence.get((err, members) => {
      console.log(members);
      setPeopleCount(members.length)
      setPeople(members)
    })
  }

  useEffect(() => {
    console.log(router);
    if (router.isReady) {

      const { game } = router.query
      if (!gameId) {
        game ? setGameId(game) : null
      }

      const ably = configureAbly({ authUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/createTokenRequest` })

      ably.connection.on((stateChange) => {
        console.log(stateChange)
      })

      const _channel = ably.channels.get(`trivia-channel-${game}`)

      _channel.presence.subscribe('update', function(member) {
        setPeopleInfo(_channel)
      });
    
      _channel.presence.subscribe('enter', (event) => {
        setPeopleInfo(_channel)
      });
    
      _channel.presence.subscribe('leave', (event) => {
        setPeopleInfo(_channel)
      });
    
      _channel.subscribe('next-question', (question) => {
        console.log('next question');
        if (!gameStarted) {
          setGameStarted(true)
        }
        setCorrectAnswer(undefined)
        setAnswers([])
        setQuestion(question.data)
      })

      _channel.subscribe('trivia-answer', (answer) => {
        setAnswers([...answers, answer])
      })

      _channel.subscribe('correct-answer', (answer) => {
        console.log(answer);
        console.log(answer.data.data);
        setCorrectAnswer(answer.data.data)
      })

      if (peopleCount === undefined && _channel) {
        setPeopleInfo(_channel)
      }

      setChannel(_channel)

      return () => {
        _channel.unsubscribe()
      }

    }
  }, [answers, gameStarted, peopleCount, channel, gameId, router]) // Only run the client

  //maybe subscribe to event to start the game

  const handleChangeGameId = (event) => {
    _gameId = event.target.value
  }

  const handleSubmitGameId = () => {
    if (!_gameId) {
      return
    }

    router.push({
        pathname: '/host',
        query: { 
          game: _gameId,
          host: true
        }
      }, 
      undefined, { shallow: true }
      )
  }

  // subscribe to users in game - display list of users (maybe points)

  if (correctAnswer) {
    return (<>
      <Layout>
      {channel ? <SVGCanvas channel={channel}/> : null}
            <h1>{question}</h1>
            <h2 className='text-primary'>Correct Answer: {correctAnswer}</h2>
       
      </Layout>
    </>)
  }

  if (!gameId) {
    return (<>
      <Layout>
        {/* <div className='flex'> */}
          <input type="text" className='input input-bordered' placeholder='Game ID' onChange={handleChangeGameId}/>
          <button className='btn btn-primary w-full' onClick={handleSubmitGameId}>Start Game</button>
          <button className='btn w-full' onClick={()=>{router.push('/')}}>Main Menu</button>
        {/* </div> */}
      </Layout>
    </>)
  }
  

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>        
        {channel ? <SVGCanvas channel={channel}/> : null}
        {gameStarted ? <>
            <h1>{question}</h1>
            <p>Answers Submitted: {answers.length}</p>
          </>
          : <>
            <h1>Waiting for everyone to join</h1>
            <PlayersWidget playersCount={peopleCount}/>
            <h2>To join go to <code className='bg-gray-700'>{window.location.origin}/join</code></h2>
            <h2>Use code <code className='bg-gray-700 tracking-[.5em]'>{gameId}</code></h2>
            { /*Need to move this to a side pane on the right */}
            <h2>People in the house:</h2>
            {people.length > 0 ? (
              people.map((person) => {
                if (person.data) {
                  return(<li>{person.data.name}</li>)
                } else {
                  return(<li>Anonymous Bowdork 🤓</li>)
                }
                
              }) 
            ):(<li>Noone yet...</li>)}
          </>
        }
        
      </Layout>
    </>
  )
}
