import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Script from 'next/script'
import { configureAbly } from '@ably-labs/react-hooks'
import { useSession } from "next-auth/react"

//Refactor constants into single doc to import
const IDENTIFIER_KEY = '__bt_id'
const USER = '__bt_user'


export default function Play() {
    const router = useRouter()

    const [input, setInput] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const [isUsername, setIsUsername] = useState(true)
    const [gameId, setGameId] = useState('')
    const [channel, setChannel] = useState(null)

    const {data: session} = useSession()
    console.log(session);

    useEffect(() => {

      if (router.isReady && !gameId && session && window) {

        const { game } = router.query
        game ? setGameId(game) : router.push('/join')
        
        if (!username) {
          console.log('setting username');
          let _user = JSON.parse(localStorage.getItem(USER))
          _user ? setUsername(_user.name) : setUsername(session.user.name)
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

        _channel.presence.enter({name: session.user.name});

        
        setChannel(_channel)

        return () => {
          _channel.unsubscribe()
        }

      }

    }, [gameId, router, channel, session, username]) // Only run the client

    
  
    const sendAnswer = (answerText) => {
      channel.publish({ name: "trivia-answer", data: answerText });
    }

    const onChangeHandler = (e) => {
        setInput(e.target.value)
    }

    const handleKeyUpSubmit = (e) => {
        console.log(e.code);
        if (( e.code === 'Enter' || e.code === 'NumpadEnter') && input) {
            sendAnswer(input)
            document.querySelector('#answer-input').value = null
            setInput(undefined)
        }
    }

    const handleSubmitName = async () => {
      setIsUsername(true)
      session.user.name = username
      channel.presence.update({name: username})
      setUsername(username)
      const localId = JSON.parse(localStorage.getItem(IDENTIFIER_KEY))
      const response = await fetch('/api/user', {
              method: 'PUT',
              body: JSON.stringify({
                  localId: localId,
                  name: username
              })
            })
        
      if (response.status == '201') {
        console.log(`User ${localId} was updated`);
      } else {
        console.error(`Error updating User ${localId}`);
      }
      session ? localStorage.setItem(USER, JSON.stringify(session.user)) : null
    }

    const handleChangeName = (event) => {
      setUsername(event.target.value)
    }

    const handleLightBulbClick = () => {
      console.log('fire away!');
      channel.publish({name: 'fire-icon', data: 'lightbulb'})
    }

  const imgStyle = {
    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.3)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))'
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.ably.com/lib/ably.min-1.js"
      ></Script>
      <Layout>
        { isUsername  ? <h1 className='flex items-center'>Hey, {username}! <span className='text-sm cursor-pointer' onClick={() => {setIsUsername(false)}}>✏️</span></h1> 
                      : <div className='flex items-center'>
                          <p>What should we call you?</p>
                          <input type='text' className='input input-bordered' placeholder='Your name here' onChange={handleChangeName}/>
                          <button className='btn' onClick={handleSubmitName}>Submit Name</button>
                        </div>}
        <label className="label">
          <span className="label-text-alt">Press <code>Enter</code> to submit question</span>
        </label>
        <input
            id='answer-input'
            className='input input-bordered w-full'
            placeholder="Your answer here"
            value={input}
            onChange={onChangeHandler}
            onKeyUp={handleKeyUpSubmit}
        />
        <button className='btn btn-primary w-full'>Submit</button>
        <div className='flex mt-5'>
          <div className='border rounded-[50%] border-neutral border-[7px] w-[100px] h-[100px] flex justify-center items-center bg-primary' onClick={handleLightBulbClick}>
            <Image width={50} height={50} src="./bowdark_logo.svg" alt="Bowdark Logo" style={imgStyle} />
          </div>
        </div>
      </Layout>
    </>
  )
}
