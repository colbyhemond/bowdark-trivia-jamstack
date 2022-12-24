import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'

export default function Join() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')

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
        <h2>Enter code to join game room</h2>
        <div className='flex gap-1'>
          <input className='input input-bordered' type='text' placeholder='Enter code here' onChange={handleCodeInput}></input>
          <button className='btn' onClick={handleJoinGame}>Join Game</button>
        </div>
      </Layout>
    </>
  )
}
