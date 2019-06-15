import React, { Component } from 'react'
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

class Auth extends Component {
  constructor () {
    super()

    this.state = {
      user: null
    }

    firebase.initializeApp(firebaseConfig)
  }

  async componentDidMount () {
    let authResult = await firebase.auth().getRedirectResult()
    if (authResult.user) {
      this.setState({
        user: authResult.user
      })
    }
  }

  signInWithGoogle () {
    console.log('sign in with Google')
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  render () {
    return <div>
      {this.state.user ?
        `Hello ${this.state.user.displayName}` :
        <button onClick={this.signInWithGoogle.bind(this)}>Sign in with Google</button>}
    </div>
  }
}

export default Auth