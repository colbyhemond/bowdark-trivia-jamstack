import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import Layout from '../components/Layout'

const getNewId = () => {
    const uid = new ShortUniqueId({ 
        length: 5,
        dictionary: 'alpha_upper' 
    })
    
    return uid()
}

export default function Create() {
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [gameId, setGameId] = useState('')
  let currentQuestion = undefined

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
    const _gameId = game ? game : getNewId()
    setGameId(_gameId)
    game ? getQuestions(game) : null
  }

  const handleAddQuestion = async () => {

    if (!currentQuestion) {
      return
    }

    const response = await fetch('/api/game', {
        method: 'POST',
        body: JSON.stringify({
            game: gameId,
            question: currentQuestion
        })
    })

    if (response.status == '201') {
      setQuestions([...questions, currentQuestion])
      document.querySelector('#question').value = null
    } else {
      // display message saying question could not be saved
    }
    
  }

  const handleStartGame = () => {
      router.push({
        pathname: '/game',
        query: { game: gameId }
      })
  }

  const handleQuestionInputChange = (e) => {
      currentQuestion = e.target.value
  }

  const handleIdInputChange = (e) => {
    gameId = e.target.value
  }

  const handleLoadSavedGame = () => {
    router.push('/load')
  }

  return (
    <>
      {/* <div className='w-screen h-screen flex justify-center items-center'>

        <div className='prose flex flex-col gap-1 items-center justify-center'> */}
        <Layout>
            <h1>Add your trivia questions</h1>
            <div className='flex items-center'>
              <p>Your Game ID is:</p>
              <input className='input input-bordered' id="gameid" type="text" placeholder='Game ID' value={gameId}/>
            </div>
            <input className='input input-bordered w-full' id="question" type='text' placeholder='What is...?' onChange={handleQuestionInputChange}/>
            <div className='flex gap-1'>
              <button className='btn btn-primary' onClick={handleAddQuestion}>Add Question</button>
              <button className='btn' onClick={handleStartGame}>Start Game</button>
              <button className='btn' onClick={handleLoadSavedGame}>Load Game</button>
            </div>
            <h2>Question Bank</h2>
            <div className='flex flex-col border rounded border-zinc-700 w-full h-[20vh] p-5 overflow-scroll'>
              {questions.length === 0 ? <p>No questions added yet</p> : questions.map((question, index) => {return(<li className='' key={`q-${index}`}>{question}</li>)})}
            </div>
            </Layout>
        {/* </div>
      </div> */}
    </>
  )
}
