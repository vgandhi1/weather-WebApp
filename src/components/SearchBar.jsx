import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel search-form"
      role="search"
      aria-label="Search city weather"
    >
      <span className="search-icon-wrap" aria-hidden>
        <Search size={20} color="currentColor" style={{ opacity: 0.85 }} />
      </span>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city…"
        className="search-input"
        aria-label="City name"
        autoComplete="off"
        enterKeyHint="search"
      />
    </form>
  );
};

export default SearchBar;
