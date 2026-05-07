import { useEffect, useRef, useState } from 'react'
import { fetchSuggestions, fetchLocation } from '../lib/places'

const INPUT_CLASS = "w-full pl-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-neutral-800 dark:border-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:ring-neutral-600"

// imperativeRef lets the parent inject a display text without triggering a new search (e.g. after swap)
export default function PlacesInput({ placeholder, onSelect, onClear, imperativeRef, onSwap }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const hasSelected = useRef(false)
  const debounceTimer = useRef(null)
  const listRef = useRef(null)

  if (imperativeRef) {
    imperativeRef.current = {
      getText() { return query },
      setText(text) {
        hasSelected.current = true
        setQuery(text)
        setSuggestions([])
        setIsOpen(false)
      },
    }
  }

  useEffect(() => {
    if (hasSelected.current) return
    clearTimeout(debounceTimer.current)
    if (query.length < 2) { setSuggestions([]); setIsOpen(false); return }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await fetchSuggestions(query)
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer.current)
  }, [query])

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => {
        const next = Math.min(i + 1, suggestions.length - 1)
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => {
        const next = Math.max(i - 1, 0)
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  function handleChange(e) {
    if (hasSelected.current) {
      hasSelected.current = false
      onClear()
    }
    setQuery(e.target.value)
  }

  async function handleSelect(suggestion) {
    setQuery(suggestion.text)
    setSuggestions([])
    setIsOpen(false)
    hasSelected.current = true
    try {
      const location = await fetchLocation(suggestion.placeId)
      onSelect(location)
    } catch {
      hasSelected.current = false
      onClear()
    }
  }

  function handleBlur() {
    // Delay so mousedown on suggestion fires before blur closes the list
    setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
        onKeyDown={handleKeyDown}
        className={INPUT_CLASS + (onSwap ? ' pr-9' : ' pr-3') + (isLoading ? ' opacity-70' : '')}
        autoComplete="off"
      />
      {onSwap && (
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); onSwap() }}
          aria-label="Swap from and to"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
            <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>
      )}
      {isOpen && suggestions.length > 0 && (
        <ul ref={listRef} className="absolute z-50 left-0 right-0 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden dark:bg-neutral-900 dark:border-white/10">
          {suggestions.map((suggestion, i) => (
            <li
              key={suggestion.placeId}
              onMouseDown={() => handleSelect(suggestion)}
              className={`px-3 py-2 text-sm text-slate-800 dark:text-neutral-200 cursor-pointer truncate ${
                i === activeIndex
                  ? 'bg-slate-100 dark:bg-neutral-800'
                  : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
              }`}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
