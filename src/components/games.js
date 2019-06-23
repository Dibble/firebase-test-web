import React, { useState } from 'react'

import { Button } from '@material-ui/core'

const getMyGames = async (user) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`
  })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/getMyGames', {
    headers
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('getMyGames failed', result.status, await result.text())
  return null
}

const createGame = async (user) => {
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
    return await result.json()
  }

  console.error('createGame failed', result.status, await result.text())
  return null
}

const joinGame = async (user) => {
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

  if (result.status === 200) {
    return await result.json()
  }

  console.error('joinGame failed', result.status, await result.text())
  return null
}

const Games = ({ user }) => {
  const [games, setGames] = useState([])

  const onGetMyGames = async () => {
    let myGames = await getMyGames(user)
    if (myGames) setGames(myGames)
  }

  const onCreateGame = async () => {
    let newGame = await createGame(user)
    if (newGame) setGames(games.concat([newGame]))
  }

  const onJoinGame = async () => {
    let joinedGame = await joinGame(user)
    if (joinedGame) setGames(games.concat(joinedGame))
  }

  return <div>
    <Button onClick={onGetMyGames}>Get My Games</Button>
    {games && games.map(game => <span id={game.id} key={game.id}>{game.name}</span>)}
    <Button onClick={onCreateGame}>Create New Game</Button>
    <input type='text' id='newGameName' placeholder='New Game Name'></input>
    <Button onClick={onJoinGame}>Join Game</Button>
    <input type='text' id='joinGameID' placeholder='Join Game ID'></input>
  </div>
}

export default Games