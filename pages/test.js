import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Test() {
    console.log('Start of Function')
    const [myValue, setMyValue] = useState(undefined)
    const [anotherValue, setAnotherValue] = useState(undefined)
    const testRef = useRef(0)

    // useEffect(() => {
    //     console.log('start of useEffect');
    //     if (!myValue) {
    //         setMyValue('Testing this value')
    //     }
    //     console.log('myValue:');
    //     console.log(myValue);
    // }, [myValue])

    // useEffect(() => {
    //     console.log('UseEffect 2!');
    //     setAnotherValue('some value here')
    //     console.log('anotherValue:');
    //     console.log(anotherValue);
    // }, [])

    useEffect(() => {
        console.log('useEffect for Ref');
        console.log(testRef.current);
    }, [testRef, myValue])
  

    console.log('Returning JSX to show on screen')
  return (
    <>
      <Layout>
        <h2>Testing Effects</h2>
        <button className='btn' onClick={()=>{testRef.current = testRef.current + 1}}>Update Ref</button>
        <button className='btn' onClick={()=>{setMyValue('test')}}>Update State</button>
      </Layout>
    </>
  )
}
