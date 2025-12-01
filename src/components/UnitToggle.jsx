import React from 'react';

const UnitToggle = ({ unit, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="glass-panel"
            style={{
                padding: '0.5rem 1rem',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginLeft: '1rem',
                minWidth: '80px'
            }}
        >
            °{unit}
        </button>
    );
};

export default UnitToggle;
