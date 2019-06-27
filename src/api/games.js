export const fetchGames = async (user) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`
  })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/getMyGames', {
    headers
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('fetchGames failed', result.status, await result.text())
  return null
}

export const createGame = async (user) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  })
  let body = JSON.stringify({ name: document.getElementById('newGameName').value })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/createGame', {
    method: 'POST',
    headers,
    body
  })

  if (result.status === 201) {
    return await result.json()
  }

  console.error('createGame failed', result.status, await result.text())
  return null
}

export const joinGame = async (user) => {
  let body = JSON.stringify({ gameID: document.getElementById('joinGameID').value })
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  })
  let result = await fetch('https://europe-west2-test-project-352b6.cloudfunctions.net/joinGame', {
    method: 'POST',
    headers,
    body
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('joinGame failed', result.status, await result.text())
  return null
}

export const getGameDetail = async (user, gameID) => {
  let headers = new Headers({
    'Authorization': `Bearer ${await user.getIdToken()}`
  })
  let result = await fetch(`https://europe-west2-test-project-352b6.cloudfunctions.net/getGameDetail?id=${gameID}`, {
    headers
  })

  if (result.status === 200) {
    return await result.json()
  }

  console.error('getGameDetail failed', result.status, await result.text())
  return null
}
