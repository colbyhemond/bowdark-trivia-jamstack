import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

const IDENTIFIER_KEY = '__bt_id'
const USER = '__bt_user'


export default function LoginButton() {
  const [localId, setLocalId] = useState(undefined)
  const [signInAttempts, setSignInAttempts] = useState(0)

  useEffect(() => {
    let _id
    if (window) {
      _id = JSON.parse(localStorage.getItem(IDENTIFIER_KEY))
    }
    setLocalId(_id)
  }, [])

  const { data: session } = useSession()
  if (session) {
    session ? localStorage.setItem(USER, JSON.stringify(session.user)) : null
    return ( null
      // <>
      //   Signed in as {session.user.name} <br />
      //   <button className="btn" onClick={() => signOut()}>Sign out</button>
      // </>
    )
  }

  if (localId && signInAttempts === 0) {
    console.log('SIGNING IN');
    setSignInAttempts(1)
    signIn('credentials', { redirect: false }, { anonUser: true, localId: localId })
    // return (
    //   <>
    //     Not signed in <br />
    //     <button className="btn" onClick={() => signIn('credentials', { redirect: false }, { anonUser: true, localId: localId })}>Sign in</button>
    //   </>
    // )
    return null
  }

  // return(
  //   <>
  //        <br />
  //       <button className="btn" disabled>Sign In</button>
  //     </>
  // )
  return null
  
}