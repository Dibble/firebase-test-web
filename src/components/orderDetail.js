import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { getGameDetail } from '../api/games'

const OrderDetail = ({ user, gameId }) => {
  const [game, setGame] = useState(null)
  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail) setGame(gameDetail)
    }

    loadGame()
  }, [])

  const goBackToGame = () => {
    window.location = `/game/${gameId}`
  }

  return <div>
    <Button onClick={goBackToGame}>Go Back</Button>
    <p>Order Detail</p>
    {game && game.players.filter((player) => player.userUID === user.uid).length === 1 && game.players.filter((player) => player.userUID === user.uid)[0].units.map((unit, idx) => (
      <p key={idx}>{unit.type} - {unit.location}</p>
    ))}
  </div>
}

export default OrderDetail