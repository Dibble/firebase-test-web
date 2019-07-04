import React, { useState, useEffect } from 'react'
import { Button, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getGameDetail } from '../api/games'
import { getAccessibleProvinces } from '../diplomacy/orders'

const useStyles = makeStyles(theme => ({
  orderTypeSelect: {
    width: '90px'
  },
  orderDetailSelect: {
    width: '200px'
  }
}))

const OrderDetail = ({ user, gameId }) => {
  const classes = useStyles()

  const [units, setUnits] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function loadGame () {
      let gameDetail = await getGameDetail(user, gameId)
      if (gameDetail && gameDetail.players.filter((player) => player.userUID === user.uid).length === 1) {
        let playerUnits = gameDetail.players.filter((player) => player.userUID === user.uid)[0].units
        setOrders(Array(playerUnits.length).fill({ type: 'Hold', detail: '' }))
        setUnits(playerUnits)
      }
    }

    loadGame()
  }, [])

  const goBackToGame = () => {
    window.location = `/game/${gameId}`
  }

  const handleOrderTypeChange = (orderIndex) => (event) => {
    let newOrders = Array.from(orders)
    newOrders[orderIndex] = Object.assign({}, orders[orderIndex], { type: event.target.value })
    setOrders(newOrders)
  }

  const handleOrderDetailChange = (orderIndex) => (event) => {
    let newOrders = Array.from(orders)
    newOrders[orderIndex] = Object.assign({}, orders[orderIndex], { detail: event.target.value })
    setOrders(newOrders)
  }

  return <div>
    <Button onClick={goBackToGame}>Go Back</Button>
    <p>Order Detail</p>
    {units && units.map((unit, idx) => (
      <div key={idx}>
        <p>{unit.type} - {unit.location}</p>
        <FormControl>
          <InputLabel htmlFor={`orderType${idx}`}>Order</InputLabel>
          <Select className={classes.orderTypeSelect} onChange={handleOrderTypeChange(idx)} value={orders[idx].type} input={<Input name={'orderType'} id={`orderType${idx}`}></Input>}>
            <MenuItem value='Hold'>Hold</MenuItem>
            <MenuItem value='Move'>Move</MenuItem>
            <MenuItem value='Support'>Support</MenuItem>
            <MenuItem value='Convoy'>Convoy</MenuItem>
          </Select>
        </FormControl>
        {orders[idx].type === 'Move' && <FormControl>
          <InputLabel htmlFor={`orderDetail${idx}`}>Province</InputLabel>
          <Select className={classes.orderDetailSelect} onChange={handleOrderDetailChange(idx)} value={orders[idx].detail} input={<Input name={'orderDetail'} id={`orderDetail${idx}`}></Input>}>
            {getAccessibleProvinces(unit, units).map((province) =>
              <MenuItem key={province.location} value={province.location}>{`${province.location}${province.requiresConvoy ? ' (requires convoy)' : ''}`}</MenuItem>
            )}
          </Select>
        </FormControl>}
      </div>
    ))}
  </div>
}

export default OrderDetail