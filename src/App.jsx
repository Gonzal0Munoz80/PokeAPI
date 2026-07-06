import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [filter, setFilter] = useState('')
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })
  const [blocked, setBlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('blocked') || '[]')
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPokemons() {
      try {
        const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
        if (!listResponse.ok) {
          throw new Error('No se pudo cargar la lista de Pokémon')
        }

        const { results } = await listResponse.json()
        const pokemonDetails = await Promise.all(
          results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url)
            if (!detailResponse.ok) {
              throw new Error(`No se pudo cargar ${pokemon.name}`)
            }
            const detail = await detailResponse.json()
            return {
              id: detail.id,
              name: pokemon.name,
              image:
                detail.sprites.other['official-artwork'].front_default ||
                detail.sprites.front_default,
              type: detail.types.map((item) => item.type.name).join(', '),
            }
          }),
        )

        setPokemons(pokemonDetails)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadPokemons()
  }, [])

  const normalizedFilter = filter.trim().toLowerCase()
  const visiblePokemons = pokemons
    .filter((pokemon) => !blocked.includes(pokemon.id))
    .filter((pokemon) => {
      return (
        normalizedFilter === '' ||
        pokemon.name.toLowerCase().includes(normalizedFilter) ||
        pokemon.type.toLowerCase().includes(normalizedFilter)
      )
    })

  const blockedPokemons = pokemons.filter((pokemon) => blocked.includes(pokemon.id))

  const handleToggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const handleToggleBlocked = (id) => {
    setBlocked((currentBlocked) =>
      currentBlocked.includes(id)
        ? currentBlocked.filter((item) => item !== id)
        : [...currentBlocked, id],
    )

    setFavorites((currentFavorites) => currentFavorites.filter((item) => item !== id))
  }

  // persist favorites and blocked to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  useEffect(() => {
    try {
      localStorage.setItem('blocked', JSON.stringify(blocked))
    } catch {}
  }, [blocked])

  // ensure favorites do not contain blocked ids (in case localStorage had both)
  useEffect(() => {
    if (blocked.length === 0) return
    setFavorites((current) => current.filter((id) => !blocked.includes(id)))
  }, [blocked])

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">PokeAPI</p>
        <h1>Catálogo de Pokémon</h1>
        <p className="subtitle">Datos cargados desde la API pública de Pokémon, con imágenes y tipos.</p>
      </header>

      {loading ? (
        <div className="status">Cargando Pokémon...</div>
      ) : error ? (
        <div className="status error">Error: {error}</div>
      ) : (
        <>
          <div className="search-bar">
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Buscar Pokémon por nombre o tipo"
              aria-label="Buscar Pokémon"
            />
          </div>

          <div className="summary-bar">
            <span>Total: {pokemons.length}</span>
            <span>Favoritos: {favorites.length}</span>
            <span>Bloqueados: {blocked.length}</span>
          </div>

          {visiblePokemons.length === 0 ? (
            <div className="status">No se encontró ningún Pokémon para "{filter}".</div>
          ) : (
            <section className="pokemon-grid">
              {visiblePokemons.map((pokemon) => {
                const isFavorite = favorites.includes(pokemon.id)
                const isBlocked = blocked.includes(pokemon.id)

                return (
                  <article key={pokemon.id} className="pokemon-card">
                    <div className="card-image">
                      <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
                    </div>
                    <div className="card-body">
                      <div className="card-top">
                        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                        {isFavorite && <span className="badge">Favorito</span>}
                      </div>
                      <h2>{pokemon.name}</h2>
                      <p className="pokemon-type">Tipo: {pokemon.type}</p>
                      <div className="card-actions">
                        <button
                          type="button"
                          className={`button button-favorite ${isFavorite ? 'active' : ''}`}
                          onClick={() => handleToggleFavorite(pokemon.id)}
                        >
                          {isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                        </button>
                        <button
                          type="button"
                          className="button button-block"
                          onClick={() => handleToggleBlocked(pokemon.id)}
                        >
                          Bloquear
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>
          )}

          {blockedPokemons.length > 0 && (
            <section className="blocked-list">
              <h2>Pokémon bloqueados</h2>
              <div className="blocked-grid">
                {blockedPokemons.map((pokemon) => (
                  <article key={pokemon.id} className="blocked-card">
                    <span className="blocked-name">{pokemon.name}</span>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleToggleBlocked(pokemon.id)}
                    >
                      Desbloquear
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default App
