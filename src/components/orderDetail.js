import React, { useState, useeffect, useEffect } from 'react'
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
    <p>user: {user.displayName}</p>
    <p>gameId: {gameId}</p>
  </div>
}

export default OrderDetail