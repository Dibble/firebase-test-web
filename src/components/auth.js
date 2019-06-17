import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDCac1XVxp35dZtU3i5tABl3AnYV2U_XjE",
  authDomain: "test-project-352b6.firebaseapp.com",
  databaseURL: "https://test-project-352b6.firebaseio.com",
  projectId: "test-project-352b6",
  storageBucket: "test-project-352b6.appspot.com",
  messagingSenderId: "768520453781",
  appId: "1:768520453781:web:6944516bedfbfbee"
}

const Auth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    firebase.initializeApp(firebaseConfig)
  }, [])

  useEffect(() => {
    async function tryGetRedirectResult () {
      let authResult = await firebase.auth().getRedirectResult()
      if (authResult.user) {
        setUser(authResult.user)
      }
    }

    tryGetRedirectResult()
  }, [])

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  const signOut = async () => {
    try {
      await firebase.auth().signOut()
      setUser(null)
    } catch (err) {
      console.error(`failed to sign out: ${err}`)
    }
  }

  return user ?
    <div>
      Hello {user.displayName}
      <button onClick={signOut}>Sign Out</button>
    </div> :
    <button onClick={signInWithGoogle}>Sign In With Google</button>
}

export default Auth