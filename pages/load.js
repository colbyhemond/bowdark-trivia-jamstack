import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'

export default function Load() {
  const router = useRouter()
  const [gameCode, setGameCode] = useState('')

  const handleLoadGame = () => {

    if (!gameCode) {
      return
    }

    router.push({
      pathname: '/create',
      query: { game: gameCode.toUpperCase() }
    })
  }

  const handleCodeInput = (event) => {
    setGameCode(event.target.value)
  }

  return (
    <>
      <Layout title='Enter code to load saved questions'>
        <div className='flex gap-1'>
          <input className='input input-bordered uppercase' type='text' placeholder='Enter code here' onChange={handleCodeInput}></input>
          <button className='btn' onClick={handleLoadGame}>Load Game</button>
        </div>
      </Layout>
    </>
  )
}
