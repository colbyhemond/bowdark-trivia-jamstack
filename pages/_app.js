import '../styles/globals.css'
import { useRouter } from 'next/router';
import { SessionProvider, getSession } from "next-auth/react"
import { useEffect, useState, useRef } from 'react'
import { useLocalStorage } from '../lib/hooks/use-local-storage';
import ShortUniqueId from 'short-unique-id'

const uid = new ShortUniqueId({length: 32})
const IDENTIFIER_KEY = '__bt_id'
const ANONYMOUS = '__bt_anon'

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {

  const [localId, setLocalId] = useState(undefined)
  
    useEffect(() => {
      if (window) {
        let _id = JSON.parse(localStorage.getItem(IDENTIFIER_KEY))
        if (!_id) {
          _id = uid() 
          localStorage.setItem(IDENTIFIER_KEY, JSON.stringify(_id));
          localStorage.setItem(ANONYMOUS, JSON.stringify(true));
        } else {
          localStorage.setItem(ANONYMOUS, JSON.stringify(false));
        }
        // setLocalId(_id)

      }
    }, [])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}