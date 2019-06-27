import React, { useState, useEffect } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { fetchGames, createGame, joinGame } from '../api/games'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(1)
  },
  gameRow: {
    cursor: 'pointer'
  }
}))

const Games = ({ user }) => {
  const classes = useStyles()

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
    let joinedGame = await joinGame(user, document.getElementById('joinGameID').value)
    if (joinedGame) setGames(games.concat(joinedGame))
  }

  return <div>
    <Typography variant='h6' className={classes.title}>My Games</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Players</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading && <TableRow>
          <TableCell align='center' colSpan={2}>Loading...</TableCell>
        </TableRow>}
        {games && games.map(game => (
          <TableRow hover={true} key={game.id} onClick={() => { window.location = `/game/${game.id}` }} className={classes.gameRow}>
            <TableCell>{game.name}</TableCell>
            <TableCell>{game.players.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Button onClick={onCreateGame}>Create New Game</Button>
    <input type='text' id='newGameName' placeholder='New Game Name'></input>
    <Button onClick={onJoinGame}>Join Game</Button>
    <input type='text' id='joinGameID' placeholder='Join Game ID'></input>
  </div >
}

export default Games