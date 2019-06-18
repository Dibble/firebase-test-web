import React from 'react'
import Auth from './auth'
import Clicker from './clicker'

import { AppBar, Toolbar, Typography } from '@material-ui/core';
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

  return <div className={classes.root}>
    <AppBar position='static'>
      <Toolbar>
        <Typography className={classes.title} variant='h6'>
          Test Project
        </Typography>
        <Auth />
      </Toolbar>
    </AppBar>
    <Clicker />
  </div>
}

export default App
