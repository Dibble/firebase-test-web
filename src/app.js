/* globals firebase */

import React, { Component } from 'react'

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null
    }
  }

  async componentDidMount () {
    let authResult = await firebase.auth().getRedirectResult()
    if (authResult.user) {
      this.setState({
        user: authResult.user
      })
    } else {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    }
  }

  render () {
    return <p>User: {this.state.user ? this.state.user.displayName : 'unknown'}</p>
  }
}

export default App
