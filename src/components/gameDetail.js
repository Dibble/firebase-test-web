import React, { useState, useEffect } from 'react'
import { Button, Icon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGameDetail } from '../api/games'

const useStyles = makeStyles(theme => ({
  button: {
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

  return <div>
    <Button variant='contained' color='secondary' className={classes.button} onClick={backToMyGames}>
      <Icon>arrow_back</Icon>
      Back to My Games
    </Button>
    {!game && <Typography variant='body1'>Loading...</Typography>}
    {game && <div>
      <Typography variant='h6'>{game.name}</Typography>
      <Table>
        <TableHead>
          <TableCell>Name</TableCell>
          <TableCell>Country</TableCell>
        </TableHead>
        <TableBody>
          {game.players.map((player) =>
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.country}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>}
  </div>
}

export default GameDetail