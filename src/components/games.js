import React, { useState, useEffect } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'

const fetchGames = async (user) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`
  })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/getMyGames', {
    headers
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('fetchGames failed', result.status, await result.text())
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
  const [games, setGames] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadGames () {
      setLoading(true)
      let myGames = await fetchGames(user)
      if (myGames) setGames(myGames)
      setLoading(false)
    }

    loadGames()
  }, [])

  const onCreateGame = async () => {
    let newGame = await createGame(user)
    if (newGame) setGames(games.concat([newGame]))
  }

  const onJoinGame = async () => {
    let joinedGame = await joinGame(user)
    if (joinedGame) setGames(games.concat(joinedGame))
  }

  return <div>
    <Typography variant='h6'>My Games</Typography>
    {loading && <Typography variant='body1'>Loading...</Typography>}
    {games &&
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map(game => (
            <TableRow key={game.id} hover={true}>
              <TableCell>{game.name}</TableCell>
              <TableCell>{game.players.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    }
    <Button onClick={onCreateGame}>Create New Game</Button>
    <input type='text' id='newGameName' placeholder='New Game Name'></input>
    <Button onClick={onJoinGame}>Join Game</Button>
    <input type='text' id='joinGameID' placeholder='Join Game ID'></input>
  </div >
}

export default Games