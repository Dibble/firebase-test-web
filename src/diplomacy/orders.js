export const getAccessibleProvinces = (selectedUnit, orders) => {
  const unit = parseUnit(selectedUnit)
  let accessibleProvinces = adjacentProvinces[unit.location]

  if (unit.type === 'F') {
    return accessibleProvinces
      .filter((province) => provinceType[province] === 'Coastal' || provinceType[province] === 'Water')
      .map((province) => ({ location: province, requiresConvoy: false }))
  }

  let directMoves = accessibleProvinces.filter((province) => provinceType[province] === 'Coastal' || provinceType[province] === 'Inland')
  let convoyMoves = getProvincesReachableByConvoy(selectedUnit, orders.map((order) => order.unit))
    .filter((province) => province !== unit.location && !directMoves.includes(province))

  return directMoves
    .map((province) => ({ location: province, requiresConvoy: false }))
    .concat(convoyMoves
      .map((province) => ({ location: province, requiresConvoy: true })))
}

export const getMovingUnits = (orders) => orders.filter((order) => order.type === 'Move').map((order) => ({ name: order.unit, destination: order.detail }))

export const getSupportableUnits = (unit, orders) => {
  const { location } = parseUnit(unit)
  return orders
    .filter((order) => {
      const orderUnit = parseUnit(order.unit)

      switch (order.type) {
        case 'Hold':
        case 'Convoy':
          return adjacentProvinces[location].includes(orderUnit.location)
        case 'Move':
          return adjacentProvinces[location].includes(order.detail)
        default:
          return false
      }
    })
    .map((order) => {
      switch (order.type) {
        case 'Move':
          return {
            name: order.unit,
            detail: order.detail
          }
        case 'Hold':
          return {
            name: order.unit,
            detail: 'Hold'
          }
        case 'Convoy':
          return {
            name: order.unit,
            detail: `Convoy ${order.detail}`
          }
      }
    })
}

const getProvincesReachableByConvoy = (unitToConvoy, units, exploredProvinces = []) => {
  const selectedUnit = parseUnit(unitToConvoy)

  let adjacentCoast = adjacentProvinces[selectedUnit.location].filter((province) => provinceType[province] === 'Coastal')
  let adjacentFleets = units
    .filter((unit) => {
      const { type, location } = parseUnit(unit)
      return type === 'F' && adjacentProvinces[selectedUnit.location].includes(location)
    })
  let adjacentFleetsToExplore = adjacentFleets.filter((fleet) => {
    const { location } = parseUnit(fleet)
    return !exploredProvinces.includes(location)
  })

  if (adjacentFleetsToExplore.length === 0) return adjacentCoast
  adjacentProvinces[selectedUnit.location].forEach((province) => {
    if (!exploredProvinces.includes(province)) exploredProvinces.push(province)
  })

  let coastAdjacentToFleets = adjacentFleetsToExplore.map((fleet) => getProvincesReachableByConvoy(fleet, units, exploredProvinces)).flat()
  return [...new Set(adjacentCoast.concat(coastAdjacentToFleets))]
}

const parseUnit = (unitString) => ({ type: unitString.slice(0, 1), location: unitString.slice(2) })

const provinceType = {
  'Bohemia': 'Inland',
  'Budapest': 'Inland',
  'Galicia': 'Inland',
  'Trieste': 'Coastal',
  'Tyrolia': 'Inland',
  'Vienna': 'Inland',
  'Clyde': 'Coastal',
  'Edinburgh': 'Coastal',
  'Liverpool': 'Coastal',
  'London': 'Coastal',
  'Wales': 'Coastal',
  'Yorkshire': 'Coastal',
  'Brest': 'Coastal',
  'Burgundy': 'Inland',
  'Gascony': 'Coastal',
  'Marseilles': 'Coastal',
  'Paris': 'Inland',
  'Picardy': 'Coastal',
  'Berlin': 'Coastal',
  'Kiel': 'Coastal',
  'Munich': 'Inland',
  'Prussia': 'Coastal',
  'Ruhr': 'Inland',
  'Silesia': 'Inland',
  'Apulia': 'Coastal',
  'Naples': 'Coastal',
  'Piedmont': 'Coastal',
  'Rome': 'Coastal',
  'Tuscany': 'Coastal',
  'Venice': 'Coastal',
  'Livonia': 'Coastal',
  'Moscow': 'Inland',
  'Sevastopol': 'Coastal',
  'St. Petersburg': 'Coastal',
  'Ukraine': 'Inland',
  'Warsaw': 'Inland',
  'Ankara': 'Coastal',
  'Armenia': 'Coastal',
  'Constantinople': 'Coastal',
  'Smyrna': 'Coastal',
  'Syria': 'Coastal',
  'Albania': 'Coastal',
  'Belgium': 'Coastal',
  'Bulgaria': 'Coastal',
  'Finland': 'Coastal',
  'Greece': 'Coastal',
  'Holland': 'Coastal',
  'Norway': 'Coastal',
  'North Africa': 'Coastal',
  'Portugal': 'Coastal',
  'Rumania': 'Coastal',
  'Serbia': 'Inland',
  'Spain': 'Coastal',
  'Sweden': 'Coastal',
  'Tunis': 'Coastal',
  'Adriatic Sea': 'Water',
  'Aegean Sea': 'Water',
  'Baltic Sea': 'Water',
  'Barents Sea': 'Water',
  'Black Sea': 'Water',
  'Eastern Mediterranean': 'Water',
  'English Channel': 'Water',
  'Gulf of Bothnia': 'Water',
  'Gulf of Lyon': 'Water',
  'Helgoland Bight': 'Water',
  'Ionian Sea': 'Water',
  'Irish Sea': 'Water',
  'Mid-Atlantic Ocean': 'Water',
  'North Atlantic Ocean': 'Water',
  'North Sea': 'Water',
  'Norwegian Sea': 'Water',
  'Skagerrak': 'Water',
  'Tyrrhenian Sea': 'Water',
  'Western Mediterranean': 'Water',
}

const adjacentProvinces = {
  'Bohemia': [
    'Munich',
    'Silesia',
    'Galicia',
    'Vienna',
    'Tyrolia',
  ],
  'Budapest': [
    'Vienna',
    'Galicia',
    'Rumania',
    'Serbia',
    'Trieste'
  ],
  'Galicia': [
    'Warsaw',
    'Ukraine',
    'Rumania',
    'Budapest',
    'Vienna',
    'Bohemia',
    'Silesia',
  ],
  'Trieste': [
    'Venice',
    'Tyrolia',
    'Vienna',
    'Budapest',
    'Serbia',
    'Albania',
    'Adriatic Sea',
  ],
  'Tyrolia': [
    'Munich',
    'Bohemia',
    'Vienna',
    'Trieste',
    'Venice',
    'Piedmont',
  ],
  'Vienna': [
    'Bohemia',
    'Galicia',
    'Budapest',
    'Trieste',
    'Tyrolia',
  ],
  'Clyde': [
    'North Atlantic Ocean',
    'Norwegian Sea',
    'Edinburgh',
    'Liverpool',
  ],
  'Edinburgh': [
    'Norwegian Sea',
    'North Sea',
    'Yorkshire',
    'Liverpool',
    'Clyde',
  ],
  'Liverpool': [
    'Clyde',
    'Edinburgh',
    'Yorkshire',
    'Wales',
    'Irish Sea',
    'North Atlantic Ocean',
  ],
  'London': [
    'Yorkshire',
    'North Sea',
    'English Channel',
    'Wales',
  ],
  'Wales': [
    'Liverpool',
    'Yorkshire',
    'London',
    'English Channel',
    'Irish Sea',
  ],
  'Yorkshire': [
    'Edinburgh',
    'North Sea',
    'London',
    'Wales',
    'Liverpool',
  ],
  'Brest': [
    'English Channel',
    'Picardy',
    'Paris',
    'Gascony',
    'Mid-Atlantic Ocean',
  ],
  'Burgundy': [
    'Paris',
    'Picardy',
    'Belgium',
    'Ruhr',
    'Munich',
    'Marseilles',
    'Gascony',
  ],
  'Gascony': [
    'Brest',
    'Paris',
    'Burgundy',
    'Marseilles',
    'Spain',
    'Mid-Atlantic Ocean',
  ],
  'Marseilles': [
    'Gascony',
    'Burgundy',
    'Piedmont',
    'Gulf of Lyon',
    'Spain',
  ],
  'Paris': [
    'Brest',
    'Picardy',
    'Burgundy',
    'Gascony',
  ],
  'Picardy': [
    'English Channel',
    'Belgium',
    'Burgundy',
    'Paris',
    'Brest',
  ],
  'Berlin': [
    'Baltic Sea',
    'Prussia',
    'Silesia',
    'Munich',
    'Kiel',
  ],
  'Kiel': [
    'Helgoland Bight',
    'Denmark',
    'Baltic Sea',
    'Berlin',
    'Munich',
    'Ruhr',
    'Holland',
  ],
  'Munich': [
    'Ruhr',
    'Kiel',
    'Berlin',
    'Silesia',
    'Bohemia',
    'Tyrolia',
    'Burgundy',
  ],
  'Prussia': [
    'Baltic Sea',
    'Livonia',
    'Warsaw',
    'Silesia',
    'Berlin',
  ],
  'Ruhr': [
    'Holland',
    'Kiel',
    'Munich',
    'Burgundy',
    'Belgium',
  ],
  'Silesia': [
    'Prussia',
    'Warsaw',
    'Galicia',
    'Bohemia',
    'Munich',
    'Berlin',
  ],
  'Apulia': [
    'Adriatic Sea',
    'Ionian Sea',
    'Naples',
    'Rome',
    'Venice',
  ],
  'Naples': [
    'Ionian Sea',
    'Tyrrhenian Sea',
    'Rome',
    'Apulia',
  ],
  'Piedmont': [
    'Tyrolia',
    'Venice',
    'Tuscany',
    'Gulf of Lyon',
    'Marseilles',
  ],
  'Rome': [
    'Tuscany',
    'Venice',
    'Apulia',
    'Naples',
    'Tyrrhenian Sea',
  ],
  'Tuscany': [
    'Piedmont',
    'Venice',
    'Rome',
    'Tyrrhenian Sea',
    'Gulf of Lyon',
  ],
  'Venice': [
    'Tyrolia',
    'Trieste',
    'Adriatic Sea',
    'Apulia',
    'Rome',
    'Tuscany',
    'Piedmont',
  ],
  'Livonia': [
    'Gulf of Bothnia',
    'St. Petersburg',
    'Moscow',
    'Warsaw',
    'Prussia',
    'Baltic Sea',
  ],
  'Moscow': [
    'St. Petersburg',
    'Sevastopol',
    'Ukraine',
    'Warsaw',
    'Livonia',
  ],
  'Sevastopol': [
    'Moscow',
    'Armenia',
    'Black Sea',
    'Rumania',
    'Ukraine',
  ],
  'St. Petersburg': [
    'Barents Sea',
    'Moscow',
    'Livonia',
    'Gulf of Bothnia',
    'Finland',
  ],
  'Ukraine': [
    'Moscow',
    'Sevastopol',
    'Rumania',
    'Galicia',
    'Warsaw',
  ],
  'Warsaw': [
    'Prussia',
    'Livonia',
    'Moscow',
    'Ukraine',
    'Galicia',
    'Silesia',
  ],
  'Ankara': [
    'Black Sea',
    'Armenia',
    'Smyrna',
    'Constantinople',
  ],
  'Armenia': [
    'Sevastopol',
    'Syria',
    'Smyrna',
    'Ankara',
    'Black Sea,'
  ],
  'Constantinople': [
    'Black Sea',
    'Ankara',
    'Smyrna',
    'Aegean Sea',
    'Bulgaria',
  ],
  'Smyrna': [
    'Constantinople',
    'Ankara',
    'Armenia',
    'Syria',
    'Eastern Mediterranean',
    'Aegean Sea',
  ],
  'Syria': [
    'Armenia',
    'Eastern Mediterranean',
    'Smyrna',
  ],
  'Albania': [
    'Trieste',
    'Serbia',
    'Greece',
    'Ionian Sea',
    'Adriatic Sea',
  ],
  'Belgium': [
    'North Sea',
    'Holland',
    'Ruhr',
    'Burgundy',
    'Picardy',
    'English Channel',
  ],
  'Bulgaria': [
    'Rumania',
    'Black Sea',
    'Constantinople',
    'Aegean Sea',
    'Greece',
    'Serbia',
  ],
  'Finland': [
    'Norway',
    'St. Petersburg',
    'Gulf of Bothnia',
    'Sweden',
  ],
  'Greece': [
    'Albania',
    'Serbia',
    'Bulgaria',
    'Aegean Sea',
    'Ionian Sea',
  ],
  'Holland': [
    'North Sea',
    'Helgoland Bight',
    'Kiel',
    'Ruhr',
    'Belgium',
  ],
  'Norway': [
    'Norwegian Sea',
    'St. Petersburg',
    'Finland',
    'Sweden',
    'Skagerrak',
    'North Sea',
  ],
  'North Africa': [
    'Tunis',
    'Mid-Atlantic Ocean',
    'Western Mediterranean',
  ],
  'Portugal': [
    'Mid-Atlantic Ocean',
    'Spain',
  ],
  'Rumania': [
    'Galicia',
    'Ukraine',
    'Sevastopol',
    'Black Sea',
    'Bulgaria',
    'Serbia',
    'Budapest',
  ],
  'Serbia': [
    'Budapest',
    'Rumania',
    'Bulgaria',
    'Greece',
    'Albania',
    'Trieste',
  ],
  'Spain': [
    'Mid-Atlantic Ocean',
    'Gascony',
    'Marseilles',
    'Gulf of Lyon',
    'Western Mediterranean',
    'Portugal',
  ],
  'Sweden': [
    'Norway',
    'Finland',
    'Gulf of Bothnia',
    'Baltic Sea',
    'Denmark',
    'Skagerrak',
  ],
  'Tunis': [
    'North Africa',
    'Western Mediterranean',
    'Tyhrrenian Sea',
    'Ionian Sea',
  ],
  'Adriatic Sea': [
    'Venice',
    'Trieste',
    'Albania',
    'Ionian Sea',
    'Apulia',
  ],
  'Aegean Sea': [
    'Greece',
    'Bulgaria',
    'Constantinople',
    'Smyrna',
    'Eastern Mediterranean',
    'Ionian Sea',
  ],
  'Baltic Sea': [
    'Gulf of Bothnia',
    'Livonia',
    'Prussia',
    'Berlin',
    'Kiel',
    'Denmark',
    'Sweden',
  ],
  'Barents Sea': [
    'St. Petersburg',
    'Norway',
    'Norwegian Sea',
  ],
  'Black Sea': [
    'Sevastopol',
    'Armenia',
    'Ankara',
    'Constantinople',
    'Bulgaria',
    'Rumania',
  ],
  'Eastern Mediterranean': [
    'Smyrna',
    'Syria',
    'Ionian Sea',
    'Aegean Sea',
  ],
  'English Channel': [
    'Wales',
    'London',
    'North Sea',
    'Belgium',
    'Picardy',
    'Brest',
    'Mid-Atlantic Ocean',
    'Irish Sea',
  ],
  'Gulf of Bothnia': [
    'Sweden',
    'Finland',
    'St. Petersburg',
    'Livonia',
    'Baltic Sea',
  ],
  'Gulf of Lyon': [
    'Spain',
    'Marseilles',
    'Piedmont',
    'Tuscany',
    'Tyrrhenian Sea',
    'Western Mediterranean',
  ],
  'Helgoland Bight': [
    'North Sea',
    'Denmark',
    'Kiel',
    'Holland',
  ],
  'Ionian Sea': [
    'Adriatic Sea',
    'Albania',
    'Greece',
    'Aegean Sea',
    'Eastern Mediterranean',
    'Tunis',
    'Tyrrhenian Sea',
    'Naples',
    'Apulia',
  ],
  'Irish Sea': [
    'North Atlantic Ocean',
    'Liverpool',
    'Wales',
    'English Channel',
    'Mid-Atlantic Ocean',
  ],
  'Mid-Atlantic Ocean': [
    'North Atlantic Ocean',
    'Irish Sea',
    'English Channel',
    'Brest',
    'Gascony',
    'Spain',
    'Portugal',
    'North Africa',
    'Western Mediterranean',
  ],
  'North Atlantic Ocean': [
    'Norwegian Sea',
    'Clyde',
    'Liverpool',
    'Irish Sea',
    'Mid-Atlantic Ocean',
  ],
  'North Sea': [
    'Norwegian Sea',
    'Norway',
    'Skagerrak',
    'Denmark',
    'Helgoland Bight',
    'Holland',
    'Belgium',
    'English Channel',
    'London',
    'Yorkshire',
    'Edinburgh',
  ],
  'Norwegian Sea': [
    'Barents Sea',
    'Norway',
    'North Sea',
    'Edinburgh',
    'Clyde',
    'North Atlantic Ocean',
  ],
  'Skagerrak': [
    'Norway',
    'Sweden',
    'Denmark',
    'North Sea',
  ],
  'Tyrrhenian Sea': [
    'Tuscany',
    'Rome',
    'Naples',
    'Ionian Sea',
    'Tunis',
    'Western Mediterranean',
    'Gulf of Lyon',
  ],
  'Western Mediterranean': [
    'Gulf of Lyon',
    'Tyrrhenian Sea',
    'Tunis',
    'North Africa',
    'Mid-Atlantic Ocean',
    'Spain',
  ],
}
