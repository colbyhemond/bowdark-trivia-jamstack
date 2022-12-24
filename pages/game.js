import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'
import { useChannel } from "../components/AblyReactEffect";
import PlayersWidget from '../components/PlayersWidget'
import SVGCanvas from '../components/SVGCanvas'
// OMWCX
export default function Game() {
  const router = useRouter()

  const [question, setQuestion] = useState(undefined)
  const [answers, setAnswers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [peopleCount, setPeopleCount] = useState(undefined)
  const [gameId, setGameId] = useState('')
  const [people, setPeople] = useState([])
  let _gameId
  

  if (router.isReady && !gameId) {
    const { game } = router.query
    game ? setGameId(game) : null
  }

  const handleBeginGame = () => {
    setGameStarted(true)
  }

  const handleChangeGameId = (event) => {
    _gameId = event.target.value
  }

  const handleSubmitGameId = () => {
    if (!_gameId) {
      return
    }

    router.push({
        pathname: '/game',
        query: { game: _gameId }
      }, 
      undefined, { shallow: true }
      )
  }

  const [channel, ably] = useChannel("bowdark-trivia", (answer) => {
    setAnswers([...answers, answer])
  });

  const setPeopleInfo = () => {
    channel.presence.get((err, members) => {
      setPeopleCount(members.length)
      setPeople(members)
    })
  }

  if (peopleCount === undefined) {
    setPeopleInfo()
  }

  channel.presence.subscribe('update', function(member) {
    setPeopleInfo()
  });

  channel.presence.subscribe('enter', (event) => {
    setPeopleInfo()
  });

  channel.presence.subscribe('leave', (event) => {
    setPeopleInfo()
  });

  // subscribe to getting the next question to display - setQuestion
  channel.subscribe('next-question', () => {
    setQuestion()
  })

  // subscribe to users in game - display list of users (maybe points)

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
        <SVGCanvas channel={channel}/>
        {gameStarted ? <>
            <h1>{question}</h1>
            <p>Answers Submitted: {answers.length}</p>
          </>
          : <>
            <h1>Waiting for everyone to join</h1>
            <PlayersWidget playersCount={peopleCount}/>
            <h2>To join go to <code className='bg-gray-700'>{window.location.origin}/join</code></h2>
            <h2>Use code <code className='bg-gray-700 tracking-[.5em]'>{gameId}</code></h2>
            {/* <button className='btn' onClick={handleBeginGame}>Begin!</button> */}
              <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/host?game=${gameId}`}>
                Open Host View
              </a>
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
