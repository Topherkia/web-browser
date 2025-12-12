// frontend/src/components/SearchEngineSelector.jsx
// Search engine selection dropdown component

import React, { useState } from 'react';
import '../styles/SearchEngineSelector.css';

const SearchEngineSelector = ({ currentEngine, onEngineChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const searchEngines = [
        { id: 'google', name: 'Google', icon: 'G' },
        { id: 'bing', name: 'Bing', icon: 'B' },
        { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'D' },
        { id: 'yahoo', name: 'Yahoo', icon: 'Y' }
    ];

    const currentEngineData = searchEngines.find(engine => engine.id === currentEngine) || searchEngines[0];

    const handleEngineSelect = (engineId) => {
        onEngineChange(engineId);
        setIsOpen(false);
    };

    return (
        <div className="search-engine-selector">
            <div 
                className="selector-header"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                aria-label="Select search engine"
                onKeyPress={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
            >
                <div className="current-engine">
                    <span className="engine-icon">{currentEngineData.icon}</span>
                    <span className="engine-name">{currentEngineData.name}</span>
                </div>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className="selector-dropdown">
                    {searchEngines.map((engine) => (
                        <div
                            key={engine.id}
                            className={`dropdown-item ${currentEngine === engine.id ? 'active' : ''}`}
                            onClick={() => handleEngineSelect(engine.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleEngineSelect(engine.id)}
                        >
                            <span className="engine-icon">{engine.icon}</span>
                            <span className="engine-name">{engine.name}</span>
                            {currentEngine === engine.id && (
                                <span className="checkmark">✓</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <div 
                    className="dropdown-backdrop" 
                    onClick={() => setIsOpen(false)}
                    role="presentation"
                />
            )}
        </div>
    );
};

export default SearchEngineSelector;