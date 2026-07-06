import React from 'react'

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onToggleBlocked }) {
  return (
    <article className="pokemon-card">
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
            onClick={() => onToggleFavorite(pokemon.id)}
          >
            {isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
          </button>
          <button type="button" className="button button-block" onClick={() => onToggleBlocked(pokemon.id)}>
            Bloquear
          </button>
        </div>
      </div>
    </article>
  )
}
