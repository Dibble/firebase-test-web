import React, { Component } from 'react'
import { Button, Typography } from '@material-ui/core'

class Clicker extends Component {
  constructor () {
    super()

    this.state = {
      clicks: 0,
      autoClickRate: 0,
      autoClickIncreaseCost: 10
    }

    this.click = this.click.bind(this)
    this.increaseAutoClickRate = this.increaseAutoClickRate.bind(this)
  }

  componentDidMount () {
    this.autoClicker = setInterval(() => {
      this.setState({
        clicks: this.state.clicks + (this.state.autoClickRate / 10)
      })
    }, 100)
  }

  componentWillUnmount () {
    clearInterval(this.autoClicker)
    this.autoClicker = null
  }

  increaseAutoClickRate () {
    if (this.state.autoClickIncreaseCost > this.state.clicks) return

    this.setState({
      autoClickRate: (this.state.autoClickRate + 0.2).toFixed(1),
      autoClickIncreaseCost: Math.floor(this.state.autoClickIncreaseCost * 1.5),
      clicks: this.state.clicks - this.state.autoClickIncreaseCost
    })
  }

  click () {
    this.setState({
      clicks: this.state.clicks + 1
    })
  }

  render () {
    return <div>
      <Typography style={{ cursor: 'pointer' }} variant='h1' onClick={this.click}>{this.state.clicks.toFixed(2)}</Typography>
      <Typography style={{ cursor: 'pointer' }} variant='h3'>{this.state.autoClickRate}/s</Typography>
      <Button disabled={this.state.autoClickIncreaseCost > this.state.clicks} variant='contained' color='primary' onClick={this.increaseAutoClickRate}>Auto Click Rate +0.2 ({this.state.autoClickIncreaseCost} clicks)</Button>
    </div>
  }
}

export default Clicker