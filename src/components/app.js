import React, { useState } from 'react'
import Auth from './auth'

import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}))

const App = () => {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState(null)

  const getMyGames = async () => {
    let headers = new Headers({
      'Authorization': `Bearer ${await user.getIdToken()}`
    })
    let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/getMyGames', {
      headers
    })

    if (result.status === 200) {
      setGames(await result.json())
    } else {
      console.error(result.status, await result.text())
    }
  }

  const createGame = async () => {
    let headers = new Headers({
      'Authorization': `Bearer ${await user.getIdToken()}`,
      'Content-Type': 'application/json'
    })
    let body = JSON.stringify({ name: document.getElementById('newGameName').value })
    let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/createGame', {
      method: 'POST',
      headers,
      body
    })

    if (result.status === 201) {
      let resultBody = await result.json()
      console.log(resultBody)
      setGames(games.concat([resultBody]))
    } else {
      let resultText = result.text()
      console.error(result.status, resultText)
    }
  }

  const joinGame = async () => {
    let body = JSON.stringify({ gameID: document.getElementById('joinGameID').value })
    let headers = new Headers({
      'Authorization': `Bearer ${await user.getIdToken()}`,
      'Content-Type': 'application/json'
    })
    let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/joinGame', {
      method: 'POST',
      headers,
      body
    })

    console.log(result.status, await result.text())
  }

  return <div className={classes.root}>
    <AppBar position='static'>
      <Toolbar>
        <Typography className={classes.title} variant='h6'>
          Diplomacy
        </Typography>
        <Auth user={user} setUser={setUser} />
      </Toolbar>
    </AppBar>
    {user &&
      <div>
        <Button onClick={getMyGames}>Get My Games</Button>
        {games && games.map(game => <span id={game.id} key={game.id}>{game.name}</span>)}
        <Button onClick={createGame}>Create New Game</Button>
        <input type='text' id='newGameName' placeholder='New Game Name'></input>
        <Button onClick={joinGame}>Join Game</Button>
        <input type='text' id='joinGameID' placeholder='Join Game ID'></input>
      </div>}
  </div>
}

export default App
