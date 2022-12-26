import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'
import LoginButton from '../components/LoginButton'

export default function Home() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')

  //animation start
  const [counter, setCounter] = useState(0)
  const [bulbs, setBulbs] = useState([])

  //animation end

  const handleCreateGame = () => {
    router.push('/create')
  }
  
  const handleStartGame = () => {
    router.push('/game')
  }

  const handleJoinGame = () => {

    if (!joinCode) {
      return
    }

    router.push({
      pathname: '/play',
      query: { game: joinCode }
    })
  }

  const handleCodeInput = (event) => {
    setJoinCode(event.target.value)
  }



  return (
    <>
      <Layout>   
        <LoginButton/>
        <h2>Hosting a game?</h2>
        <div className='flex gap-5'>
          <button className='btn' onClick={handleCreateGame}>Create/Edit Game</button>
          <button className='btn btn-primary' onClick={handleStartGame}>Start Game</button>
        </div>
        <h2>Here to play?</h2>
        <div className='flex gap-1'>
          <input className='input input-bordered' type='text' placeholder='Enter code here' onChange={handleCodeInput}></input>
          <button className='btn btn-primary' onClick={handleJoinGame}>Join Game</button>
        </div>
      </Layout>
    </>
  )
}
