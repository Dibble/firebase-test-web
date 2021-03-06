import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Auth from './auth'
import Games from './games'
import GameDetail from './gameDetail'
import OrderDetail from './orderDetail'

import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
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

  return <Router>
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography className={classes.title} variant='h6'>
            <Link to='/' className={classes.link}>Diplomacy</Link>
          </Typography>
          <Auth user={user} setUser={setUser} />
        </Toolbar>
      </AppBar>
      {user && <div>
        <Route exact path="/" render={() => (
          <Games user={user} />
        )} />
        <Route exact path="/game/:gameId" render={({ match }) => (
          <GameDetail user={user} gameId={match.params.gameId} />
        )} />
        <Route exact path="/game/:gameId/orders" render={({ match }) => (
          <OrderDetail user={user} gameId={match.params.gameId} />
        )} />
      </div>}
    </div>
  </Router>
}

export default App
