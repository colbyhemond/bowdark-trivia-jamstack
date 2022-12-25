import Script from 'next/script'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
// import { useChannel } from "../components/AblyReactEffect";
import PlayersWidget from '../components/PlayersWidget'
import SVGCanvas from '../components/SVGCanvas'
import { configureAbly } from '@ably-labs/react-hooks'

export default function Game() {
  const router = useRouter()

  const [question, setQuestion] = useState(undefined)
  const [answers, setAnswers] = useState([])
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
    const ably = configureAbly({ authUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/createTokenRequest` })

    ably.connection.on((stateChange) => {
      console.log(stateChange)
    })

    const _channel = ably.channels.get('bowdark-trivia') //@TODO: change bowdark-trivia to the generated gameId once finialized
    // _channel.subscribe((message) => {
    //     setLogs(prev => [...prev, new LogEntry(`✉️ event name: ${message.name} text: ${message.data.text}`)])
    // })

    _channel.presence.subscribe('update', function(member) {
      setPeopleInfo(_channel)
    });
  
    _channel.presence.subscribe('enter', (event) => {
      setPeopleInfo(_channel)
    });
  
    _channel.presence.subscribe('leave', (event) => {
      setPeopleInfo(_channel)
    });
  
    _channel.subscribe('next-question', (question) => { //@TODO need to make sure that this is being published from /host.js
      setQuestion(question)
    })

    if (peopleCount === undefined && _channel) {
      setPeopleInfo(_channel)
    }

    setChannel(_channel)

    return () => {
      _channel.unsubscribe()
    }
  }, []) // Only run the client

  //maybe subscribe to event to start the game

  if (router.isReady && !gameId) {
    const { game } = router.query
    game ? setGameId(game) : null
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
        query: { 
          game: _gameId,
          host: true
        }
      }, 
      undefined, { shallow: true }
      )
  }
 
  

  const returnHostButton = () => {
    return (<>
          <button className='btn btn-primary' onClick={()=>{window.open(`${window.location.origin}/host?game=${gameId}`, '_ blank', 'rel="noopener,rel="noreferrer"')}}>Open Host View</button>
    </>)
  }

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
      { router.isReady && router.query && router.query.host ? returnHostButton() : null}
        
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
            {/* <button className='btn' onClick={handleBeginGame}>Begin!</button> */}
              <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/host?game=${gameId}`}>
                Open Host View
              </a>
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
