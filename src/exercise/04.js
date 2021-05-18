// Cache resources
// http://localhost:3000/isolated/exercise/04.js

import {context} from 'msw'
import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

const PokemonCacheContext = React.createContext()

function usePokemonCacheContext() {
  const context = React.useContext(PokemonCacheContext)

  if (!context) {
    throw new Error('Errorrrrrrrr')
  }

  return context
}

function PokemonCacheProvider({children}) {
  const cache = React.useRef({})

  // Add a useCallback so that it's stable through re-renders and
  // can use it in the useEffect dependency list.
  const getPokemonResource = React.useCallback(name => {
    let resource = cache.current[name]

    if (!resource) {
      resource = createPokemonResource(name)
      cache.current[name] = resource
    }

    return resource
  }, [])

  return (
    <PokemonCacheContext.Provider value={getPokemonResource}>
      {children}
    </PokemonCacheContext.Provider>
  )
}

function App() {
  const PokeResource = usePokemonCacheContext()
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(PokeResource(pokemonName))
    })
  }, [PokeResource, pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

function AppWithProvider() {
  return (
    <PokemonCacheProvider>
      <App />
    </PokemonCacheProvider>
  )
}

export default AppWithProvider
