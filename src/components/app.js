import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Auth from './auth'
import Games from './games'

import { AppBar, Toolbar, Typography } from '@material-ui/core'
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

  return <Router>
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography className={classes.title} variant='h6'>
            Diplomacy
        </Typography>
          <Auth user={user} setUser={setUser} />
        </Toolbar>
      </AppBar>
      {user && <Route path="/" render={() => (
        <Games user={user} />
      )} />}
    </div>
  </Router>
}

export default App
