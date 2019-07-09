export const submitOrders = async (user, gameID, round, orders) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  })
  let body = JSON.stringify({ gameID, round, orders })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/submitOrders', {
    method: 'POST',
    body,
    headers,
  })

  if (result.status === 200) {
    return true
  }

  console.error('submitOrders failed', result.status, await result.text())
  return false
}

export const getOrderDetail = async (user, gameID) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`
  })
  let result = await fetch(`https://europe-west2-test-project-352b6.cloudfunctions.net/getOrderDetail?gameID=${gameID}`, {
    headers,
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('getOrderDetail failed', result.status, await result.text())
  return null
}