import React, { useState, useEffect } from 'react'
import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getOrderDetail, submitOrders } from '../api/orders'
import { getAccessibleProvinces, getMovingUnits, getSupportableUnits } from '../diplomacy/orders'

const useStyles = makeStyles(theme => ({
  orderTypeSelect: {
    minWidth: '90px'
  },
  orderDetailSelect: {
    minWidth: '90px'
  },
  orderElement: {
    margin: theme.spacing(1)
  },
  unit: {
    margin: theme.spacing(2)
  }
}))

const OrderDetail = ({ user, gameId }) => {
  const classes = useStyles()

  const [round, setRound] = useState(null)
  const [country, setCountry] = useState(null)
  const [orders, setOrders] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadOrders () {
      let result = await getOrderDetail(user, gameId)
      if (result) {
        setOrders(result.orders)
        setCountry(result.country)
        setRound(result.round)
      }
    }

    loadOrders()
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

  const onSubmitOrders = async () => {
    setSubmitting(true)
    let myOrders = {}
    myOrders[country] = orders

    await submitOrders(user, gameId, round, myOrders)
    setSubmitting(false)
  }

  return <div>
    <Button onClick={goBackToGame}>Go Back</Button>
    <Typography variant='h6'>Orders {country ? country : ''} {round ? round : ''}</Typography>
    {orders && orders.map((order, idx) => (
      <div key={idx} className={classes.unit}>
        <Typography variant='body1'>{order.unit}</Typography>
        <Grid container direction='row' alignItems='center'>
          <Grid item className={classes.orderElement}>
            <FormControl>
              <InputLabel htmlFor={`orderType${idx}`}>Order</InputLabel>
              <Select autoWidth className={classes.orderTypeSelect} onChange={handleOrderTypeChange(idx)} value={order.type} input={<Input name={'orderType'} id={`orderType${idx}`}></Input>}>
                <MenuItem value='Hold'>Hold</MenuItem>
                <MenuItem value='Move'>Move</MenuItem>
                <MenuItem value='Support'>Support</MenuItem>
                {order.unit.startsWith('F') && <MenuItem value='Convoy'>Convoy</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
          {order.type === 'Move' &&
            <Grid item className={classes.orderElement}>
              <FormControl>
                <InputLabel htmlFor={`orderDetail${idx}`}>Province</InputLabel>
                <Select autoWidth className={classes.orderDetailSelect} onChange={handleOrderDetailChange(idx)} value={order.detail} input={<Input name={'orderDetail'} id={`orderDetail${idx}`}></Input>}>
                  {getAccessibleProvinces(order.unit, orders).map((province) =>
                    <MenuItem key={province.location} value={province.location}>{`${province.location}${province.requiresConvoy ? ' (requires convoy)' : ''}`}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          }
          {order.type === 'Support' &&
            <Grid item className={classes.orderElement}>
              <FormControl>
                <InputLabel htmlFor={`orderDetail${idx}`}>Unit</InputLabel>
                <Select autoWidth className={classes.orderDetailSelect} onChange={handleOrderDetailChange(idx)} value={order.detail} input={<Input name={'orderDetail'} id={`orderDetail${idx}`}></Input>}>
                  {getSupportableUnits(order.unit, orders).map((unit) =>
                    <MenuItem key={unit.name} value={unit.name}>{`${unit.name} - ${unit.detail}`}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          }
          {order.type === 'Convoy' &&
            <Grid item className={classes.orderElement}>
              <FormControl>
                <InputLabel htmlFor={`orderDetail${idx}`}>Unit</InputLabel>
                <Select autoWidth className={classes.orderDetailSelect} onChange={handleOrderDetailChange(idx)} value={order.detail} input={<Input name={'orderDetail'} id={`orderDetail${idx}`}></Input>}>
                  {getMovingUnits(orders).map((unit) => {
                    const convoy = `${unit.name} - ${unit.destination}`
                    return <MenuItem key={unit.name} value={convoy}>{convoy}</MenuItem>
                  }
                  )}
                </Select>
              </FormControl>
            </Grid>
          }
        </Grid>
      </div>
    ))}
    {orders.length > 0 &&
      <Button onClick={onSubmitOrders}>Submit Orders</Button>
    }
    {submitting && <Typography variant='body1'>Submitting...</Typography>}
  </div>
}

export default OrderDetail