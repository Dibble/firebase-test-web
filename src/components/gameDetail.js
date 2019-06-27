import React, { useState, useEffect } from 'react'
import { Button, Icon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGameDetail, joinGame } from '../api/games'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  title: {
    margin: theme.spacing(1)
  }
}))

const GameDetail = ({ gameId, user }) => {
  const classes = useStyles()

  const [game, setGame] = useState(null)
  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail) setGame(gameDetail)
    }

    loadGame()
  }, [])

  const backToMyGames = () => {
    window.location = '/'
  }

  const onJoinGame = async () => {
    let joinedGame = await joinGame(user, gameId)
    if (joinedGame) setGame(joinedGame)
  }

  return <div>
    <Button variant='contained' color='secondary' className={classes.button} onClick={backToMyGames}>
      <Icon>arrow_back</Icon>
      Back to My Games
    </Button>
    {!game && <Typography variant='body1' className={classes.title}>Loading...</Typography>}
    {game && <div>
      <Typography variant='h6' className={classes.title}>{game.name}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {game.players.map((player) =>
            <TableRow key={player.id}>
              <TableCell>{player.name}{player.email ? ` (${player.email})` : ''}</TableCell>
              <TableCell>{player.country ? player.country : 'Not Assigned'}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
      {!game.players.some((player) => player.userUID === user.uid) &&
        <Button variant='contained' color='secondary' className={classes.button} onClick={onJoinGame}>
          <Icon>add</Icon>
          Join Game
        </Button>}
    </div>}
  </div>
}

export default GameDetail