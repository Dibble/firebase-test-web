import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core'
import { getGameDetail } from '../api/games'

const GameDetail = ({ gameId, user }) => {
  const [game, setGame] = useState(null)
  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail) setGame(gameDetail)
    }

    loadGame()
  }, [])

  return <div>
    {!game && <Typography variant='body1'>Loading...</Typography>}
    {game && <div>
      <Typography variant='h6'>{game.name}</Typography>
      <Table>
        <TableBody>
          {game.players.map((player) =>
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>}
  </div>
}

export default GameDetail