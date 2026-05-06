import React from 'react';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';

const AppHeader = ({ onSearch, unit, onUnitChange }) => (
  <header className="app-header">
    <div className="app-header__brand">
      <span className="app-header__title">Weather</span>
      <span className="app-header__tag">Dashboard</span>
    </div>
    <div className="app-header__search-wrap">
      <SearchBar onSearch={onSearch} />
    </div>
    <div className="app-header__controls">
      <UnitToggle unit={unit} onChange={onUnitChange} />
    </div>
  </header>
);

export default AppHeader;
