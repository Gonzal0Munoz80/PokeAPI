import React from 'react'

export default function SearchBar({ filter, setFilter }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Buscar Pokémon por nombre o tipo"
        aria-label="Buscar Pokémon"
      />
    </div>
  )
}
