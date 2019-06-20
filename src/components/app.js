import React, { useState } from 'react'
import Auth from './auth'

import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}))

const App = () => {
  const classes = useStyles()
  const [user, setUser] = useState(null)
  const [games, setGames] = useState(null)

  const getMyGames = async () => {
    let headers = new Headers({
      'Authorization': `Bearer ${await user.getIdToken()}`
    })
    let result = await fetch('https://us-central1-test-project-352b6.cloudfunctions.net/getMyGames', {
      headers
    })

    if (result.status === 200) {
      setGames(await result.json())
    } else {
      console.error(result.status, await result.text())
    }
  }

  return <div className={classes.root}>
    <AppBar position='static'>
      <Toolbar>
        <Typography className={classes.title} variant='h6'>
          Diplomacy
        </Typography>
        <Auth user={user} setUser={setUser} />
      </Toolbar>
    </AppBar>
    {user &&
      <div>
        <Button onClick={getMyGames}>Get My Games</Button>
        {games && games.map(game => <span id={game.id} key={game.id}>{game.name}</span>)}
      </div>}
  </div>
}

export default App
