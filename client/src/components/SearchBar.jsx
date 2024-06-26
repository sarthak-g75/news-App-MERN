import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'

const SearchBar = ({ onSearch, name }) => {
  const [query, setQuery] = useState('')

  const debouncedSearch = debounce((value) => {
    onSearch(value)
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query])

  return (
    <input
      type='text'
      className='flex-grow w-full px-4 py-2 border rounded-md'
      placeholder={`Search ${name}`}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

export default SearchBar
