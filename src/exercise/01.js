// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

import {fetchPokemon, PokemonDataView} from '../pokemon'

let pokemon

const pokemonPromise = fetchPokemon('pikachu')

const onSuccess = data => (pokemon = data)

pokemonPromise.then(onSuccess)

function PokemonInfo() {
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
        <React.Suspense fallback={<MyFallBack />}>
          <PokemonInfo />
        </React.Suspense>
      </div>
    </div>
  )
}

export default App
