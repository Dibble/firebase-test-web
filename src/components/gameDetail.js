import React, { useState, useEffect } from 'react'
import { Button, Chip, Grid, Icon, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGameDetail, joinGame, assignCountries, startGame } from '../api/games'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  chip: {
    margin: theme.spacing(1)
  },
  chipRed: {
    margin: theme.spacing(1),
    backgroundColor: '#e01c00'
  },
  chipDarkBlue: {
    margin: theme.spacing(1),
    backgroundColor: '#0062c6',
    color: 'white'
  },
  chipLightBlue: {
    margin: theme.spacing(1),
    backgroundColor: '#00b2d4'
  },
  chipBlack: {
    margin: theme.spacing(1),
    backgroundColor: 'black',
    color: 'white'
  },
  chipGreen: {
    margin: theme.spacing(1),
    backgroundColor: '#019a01'
  },
  chipWhite: {
    margin: theme.spacing(1),
    backgroundColor: 'white'
  },
  chipYellow: {
    margin: theme.spacing(1),
    backgroundColor: '#ffcf00'
  },
  userEmail: {
    color: 'gray'
  },
  title: {
    margin: theme.spacing(1)
  }
}))

const GameDetail = ({ gameId, user }) => {
  const classes = useStyles()

  const [game, setGame] = useState(null)
  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail) setGame(gameDetail)
    }

    loadGame()
  }, [])

  const backToMyGames = () => {
    window.location = '/'
  }

  const onJoinGame = async () => {
    let joinedGame = await joinGame(user, gameId)
    if (joinedGame) setGame(joinedGame)
  }

  const onAssignCountries = async () => {
    let updatedGame = await assignCountries(user, gameId)
    if (updatedGame) setGame(updatedGame)
  }

  const onStartGame = async () => {
    let updatedGame = await startGame(user, gameId)
    if (updatedGame) setGame(updatedGame)
  }

  const onViewOrders = async () => {
    window.location = `${window.location}/orders`
  }

  const getGameStateIcon = (gameState) => {
    switch (gameState) {
      case 'Setup':
        return 'assignment'
      case 'Countries Assigned':
        return 'language'
      case 'Active':
        return 'check_circle'
      case 'Complete':
        return 'flag'
    }
  }

  const getCountryColor = (country) => {
    switch (country) {
      case 'Austria':
        return classes.chipRed
      case 'England':
        return classes.chipDarkBlue
      case 'France':
        return classes.chipLightBlue
      case 'Germany':
        return classes.chipBlack
      case 'Italy':
        return classes.chipGreen
      case 'Russia':
        return classes.chipWhite
      case 'Turkey':
        return classes.chipYellow
      default:
        return classes.chip
    }
  }

  return <div>
    <Button variant='text' color='primary' className={classes.button} onClick={backToMyGames}>
      <Icon>arrow_back</Icon>
      Back to My Games
    </Button>
    {!game && <Typography variant='body1' className={classes.title}>Loading...</Typography>}
    {game && <Grid container direction='column' justify='center' alignItems='stretch'>
      <Grid container direction='row' justify='space-between' alignItems='center'>
        <Grid container item direction='row' justify='flex-start' alignItems='center'>
          <Grid item>
            <Typography variant='h5' className={classes.title}>{game.name}</Typography>
          </Grid>
          <Grid item>
            <Chip className={classes.chip} label={`${game.players.length}/7 Players`} icon={<Icon>face</Icon>} />
          </Grid>
          <Grid item>
            <Chip className={classes.chip} label={game.currentState} icon={<Icon>{getGameStateIcon(game.currentState)}</Icon>} />
          </Grid>
        </Grid>
        <Grid container direction='row' justify='flex-end' alignItems='center'>
          {game.currentState === 'Setup' && !game.players.some((player) => player.userUID === user.uid) &&
            <Grid item>
              <Button variant='contained' color='secondary' className={classes.button} onClick={onJoinGame}>
                <Icon>add</Icon>
                Join Game
              </Button>
            </Grid>
          }
          {game.currentState === 'Setup' && game.players.length === 7 &&
            <Grid item>
              <Button variant='contained' color='secondary' className={classes.button} onClick={onAssignCountries}>
                <Icon>language</Icon>
                Assign Countries
              </Button>
            </Grid>
          }
          {game.currentState === 'Countries Assigned' &&
            <Grid item>
              <Button variant='contained' color='secondary' className={classes.button} onClick={onStartGame}>
                <Icon>play_arrow</Icon>
                Start Game
              </Button>
            </Grid>
          }
          {game.currentState === 'Active' &&
            <Grid item>
              <Typography variant='h6' className={classes.title}>Current Round: {game.currentRound}</Typography>
            </Grid>
          }
        </Grid>
      </Grid>
      <Grid item>
        <Button onClick={onViewOrders}>Submit Orders</Button>
      </Grid>
      <Grid item>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {game.players.map((player) =>
              <TableRow key={player.id} selected={player.userUID === user.uid} hover>
                <TableCell>{player.name}{player.email ? <small className={classes.userEmail}>{` (${player.email})`}</small> : ''}</TableCell>
                <TableCell><Chip variant={player.country === 'Russia' ? 'outlined' : 'default'} className={getCountryColor(player.country)} label={player.country ? player.country : 'Not Assigned'} /></TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
    }
  </div >
}

export default GameDetail