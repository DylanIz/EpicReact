// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {fetchPokemon} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'
import sadpokemon from './sadpokemon.jpg'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: 'resolved'})
      },
      error => {
        setState({error, status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('Impossible!')
}

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <img src={sadpokemon} alt="Error" />
      <button onClick={resetErrorBoundary}>Try Again!</button>
    </div>
  )
}

// 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
// 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
// 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
// (This is to enable the loading state when switching between different pokemon.)
// 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
//   fetchPokemon('Pikachu').then(
//     pokemonData => {/* update all the state here */},
//   )
// 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
//   1. no pokemonName: 'Submit a pokemon'
//   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
//   3. pokemon: <PokemonDataView pokemon={pokemon} />

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const handleReset = () => {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
