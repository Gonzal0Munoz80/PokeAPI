import React, { useEffect, useState } from 'react'

export default function SearchBar({ filter, setFilter }) {
  const [local, setLocal] = useState(filter)

  useEffect(() => setLocal(filter), [filter])

  // debounce user input before propagating to parent
  useEffect(() => {
    const id = setTimeout(() => setFilter(local), 240)
    return () => clearTimeout(id)
  }, [local, setFilter])

  return (
    <div className="search-bar">
      <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Buscar Pokémon por nombre o tipo"
        aria-label="Buscar Pokémon"
      />

      {local && (
        <button
          className="clear-btn"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            setLocal('')
            setFilter('')
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
