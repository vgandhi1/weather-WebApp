import React from 'react';

const UnitToggle = ({ unit, onChange }) => (
  <div className="unit-segment" role="group" aria-label="Temperature unit">
    <button
      type="button"
      aria-pressed={unit === 'C'}
      onClick={() => onChange('C')}
    >
      °C
    </button>
    <button
      type="button"
      aria-pressed={unit === 'F'}
      onClick={() => onChange('F')}
    >
      °F
    </button>
  </div>
);

export default UnitToggle;
