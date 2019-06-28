import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { getGameDetail } from '../api/games'

const OrderDetail = ({ user, gameId }) => {
  const [units, setUnits] = useState(null)

  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail && gameDetail.players.filter((player) => player.userUID === user.uid).length === 1) {
        let playerUnits = gameDetail.players.filter((player) => player.userUID === user.uid)[0].units
        setUnits(playerUnits)
      }
    }

    loadGame()
  }, [])

  const goBackToGame = () => {
    window.location = `/game/${gameId}`
  }

  return <div>
    <Button onClick={goBackToGame}>Go Back</Button>
    <p>Order Detail</p>
    {units && units.map((unit, idx) => (
      <p key={idx}>{unit.type} - {unit.location}</p>
    ))}
  </div>
}

export default OrderDetail