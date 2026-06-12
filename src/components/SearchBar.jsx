import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, LocateFixed, Clock } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

const RECENTS_KEY = 'weather.recents';

const loadRecents = () => {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const saveRecent = (label) => {
  try {
    const next = [label, ...loadRecents().filter((r) => r !== label)].slice(0, 5);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadRecents();
  }
};

const SearchBar = ({ onSearch, onLocate, locating = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recents, setRecents] = useState(loadRecents);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    // All setState happens inside the timeout callback (not synchronously in the
    // effect body) to avoid cascading renders.
    debounceRef.current = setTimeout(
      async () => {
        if (q.length < 2) {
          setSuggestions([]);
          setActiveIdx(-1);
          return;
        }
        const results = await searchCities(q);
        setSuggestions(results);
        setActiveIdx(-1);
      },
      q.length < 2 ? 0 : 300
    );
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query]);

  const commit = useCallback(
    (label) => {
      const value = (label || '').trim();
      if (!value) return;
      onSearch(value);
      setRecents(saveRecent(value));
      setQuery('');
      setSuggestions([]);
      setOpen(false);
      setActiveIdx(-1);
    },
    [onSearch]
  );

  const showSuggestions = query.trim().length >= 2 && suggestions.length > 0;
  const showRecents = query.trim().length < 2 && recents.length > 0;
  const list = showSuggestions
    ? suggestions.map((s) => ({ key: `${s.lat},${s.lon}`, label: s.label }))
    : showRecents
    ? recents.map((r) => ({ key: r, label: r }))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIdx >= 0 && list[activeIdx]) commit(list[activeIdx].label);
    else commit(query);
  };

  const onKeyDown = (e) => {
    if (!open || list.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + list.length) % list.length);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const clearRecents = () => {
    try {
      localStorage.removeItem(RECENTS_KEY);
    } catch {
      /* ignore storage errors */
    }
    setRecents([]);
  };

  return (
    <div className="search-wrap" ref={wrapRef}>
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
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search for a city…"
          className="search-input"
          aria-label="City name"
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={open && list.length > 0}
          aria-controls="search-listbox"
          aria-autocomplete="list"
        />
        {onLocate && (
          <button
            type="button"
            className="search-locate"
            onClick={onLocate}
            disabled={locating}
            aria-label="Use my location"
            title="Use my location"
          >
            <LocateFixed size={18} className={locating ? 'search-locate--spin' : ''} aria-hidden />
          </button>
        )}
      </form>

      {open && list.length > 0 && (
        <ul className="search-suggest glass-panel" id="search-listbox" role="listbox">
          {showRecents && (
            <li className="search-suggest__head">
              <span>Recent</span>
              <button type="button" className="search-suggest__clear" onClick={clearRecents}>
                Clear
              </button>
            </li>
          )}
          {list.map((it, i) => (
            <li key={it.key} role="option" aria-selected={i === activeIdx}>
              <button
                type="button"
                className={`search-suggest__item${i === activeIdx ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => commit(it.label)}
              >
                {showRecents ? <Clock size={14} aria-hidden /> : <Search size={14} aria-hidden />}
                <span>{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
