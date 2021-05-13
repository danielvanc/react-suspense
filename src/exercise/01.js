// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

import {fetchPokemon, PokemonDataView, PokemonErrorBoundary} from '../pokemon'

let pokemon
let pokemonError

const pokemonPromise = fetchPokemon('pikachu')
// In order to handle errors with error boundaries when using suspense,
// You must make sure your promise handles the error and throws it
const onSuccess = data => (pokemon = data)
const onFailure = error => (pokemonError = error)

pokemonPromise.then(onSuccess, onFailure)

function PokemonInfo() {
  if (pokemonError) throw pokemonError
  if (!pokemon) throw pokemonPromise

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function MyFallBack() {
  return <p>Loading... or not</p>
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <React.Suspense fallback={<MyFallBack />}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
