import React from 'react'

const Game = ({ gameId, user }) => {
  return <div>
    <p>{user.displayName}</p>
    <p>{gameId}</p>
  </div>
}

export default Game