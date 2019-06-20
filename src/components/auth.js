import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { Button, Menu, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const firebaseConfig = {
  apiKey: "AIzaSyDCac1XVxp35dZtU3i5tABl3AnYV2U_XjE",
  authDomain: "test-project-352b6.firebaseapp.com",
  databaseURL: "https://test-project-352b6.firebaseio.com",
  projectId: "test-project-352b6",
  storageBucket: "test-project-352b6.appspot.com",
  messagingSenderId: "768520453781",
  appId: "1:768520453781:web:6944516bedfbfbee"
}

const useStyles = makeStyles(theme => ({
  displayName: {
    cursor: 'pointer'
  }
}))

const Auth = ({ user, setUser }) => {
  const classes = useStyles()
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)

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
      <Typography className={classes.displayName} onClick={(event) => setMenuAnchorElement(event.currentTarget)}>{user.displayName}</Typography>
      <Menu anchorEl={menuAnchorElement} open={Boolean(menuAnchorElement)} onClose={() => setMenuAnchorElement(null)}>
        <MenuItem onClick={() => { setMenuAnchorElement(null); signOut() }}>Sign Out</MenuItem>
      </Menu>
    </div> :
    <Button color='primary' variant='contained' onClick={signInWithGoogle}>Sign In With Google</Button>
}

export default Auth