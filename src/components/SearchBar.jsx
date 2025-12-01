import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '500px'
        }}>
            <Search size={20} color="rgba(255,255,255,0.8)" style={{ marginRight: '1rem' }} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.1rem',
                    width: '100%',
                    '::placeholder': { color: 'rgba(255,255,255,0.5)' }
                }}
            />
        </form>
    );
};

export default SearchBar;
