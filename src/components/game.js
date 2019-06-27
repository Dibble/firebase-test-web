import React, { useState, useEffect } from 'react'
import { getGameDetail } from '../api/games'

const Game = ({ gameId, user }) => {
  const [game, setGame] = useState(null)
  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail) setGame(gameDetail)
    }

    loadGame()
  }, [])

  return <div>
    <p>{gameId}</p>
    {game && <p>{game.name}</p>}
  </div>
}

export default Game