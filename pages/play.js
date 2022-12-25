import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
// import { useChannel } from "../components/AblyReactEffect";
import Script from 'next/script'
import * as Ably from 'ably/promises'
import { configureAbly } from '@ably-labs/react-hooks'

export default function Play() {
    const router = useRouter()

    const [input, setInput] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const [isUsername, setIsUsername] = useState(false)
    const [gameId, setGameId] = useState('')
    const [channel, setChannel] = useState(null)

    // const [channel, ably] = useChannel("bowdark-trivia", (message) => {
    //   console.log('received answer:');
    //   console.log(message);
    // });

    useEffect(() => {
      const ably = configureAbly({ authUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/createTokenRequest` })
  
      ably.connection.on((stateChange) => {
        console.log(stateChange)
      })
  
      const _channel = ably.channels.get('bowdark-trivia') //@TODO: change bowdark-trivia to the generated gameId once finialized

      //@TODO: If needed to subscribe to get current question, do that here
      // _channel.subscribe((message) => {
      //     setLogs(prev => [...prev, new LogEntry(`✉️ event name: ${message.name} text: ${message.data.text}`)])
      // })

      if (router.isReady && !gameId) {
        const { game } = router.query
        game ? setGameId(game) : router.push('/join')
        _channel.presence.enter();
      }
      
      setChannel(_channel)
  
      return () => {
        _channel.unsubscribe()
      }
    }, []) // Only run the client

    
  
    const sendAnswer = (answerText) => {
      //If this proves to be too much for connections, then maybe switch to server to use REST - use /api/pub-sub/publish - see next example
      channel.publish({ name: "trivia-answer", data: answerText });
    }

    const onChangeHandler = (e) => {
        setInput(e.target.value)
    }

    const handleKeyUpSubmit = (e) => {
        if (e.code === 'Enter' && input) {
            sendAnswer(input)
            document.querySelector('#answer-input').value = null
            setInput(undefined)
        }
    }

    const handleSubmitName = () => {
      setIsUsername(true)
      channel.presence.update({name: username})
    }

    const handleChangeName = (event) => {
      setUsername(event.target.value)
    }

    const handleLightBulbClick = () => {
      console.log('fire away!');
      channel.publish({name: 'fire-icon', data: 'lightbulb'})
    }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>
        { isUsername  ? <h1>Hey, {username}!</h1> 
                      : <div className='flex items-center'>
                          <p>What should we call you?</p>
                          <input type='text' className='input input-bordered' placeholder='Your name here' onChange={handleChangeName}/>
                          <button className='btn' onClick={handleSubmitName}>Submit Name</button>
                        </div>}
        <input
            id='answer-input'
            className='input input-bordered w-full'
            placeholder="Your answer here"
            value={input}
            onChange={onChangeHandler}
            onKeyUp={handleKeyUpSubmit}
        />
        <label className="label">
          <span className="label-text-alt">Press <code>Enter</code> to submit question</span>
        </label>
        <div className='flex mt-5'>
          <div className='border rounded-[50%] border-neutral border-[7px] w-[100px] h-[100px] flex justify-center items-center bg-primary' onClick={handleLightBulbClick}>
            <Image width={50} height={50} src="./bowdark_logo.svg" alt="Bowdark Logo" />
          </div>
        </div>
      </Layout>
    </>
  )
}
