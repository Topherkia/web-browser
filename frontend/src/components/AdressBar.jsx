// frontend/src/components/AddressBar.jsx
// Address bar component for URL navigation and search

import React, { useState } from 'react';
import '../styles/AddressBar.css';

const AddressBar = ({ currentUrl, onNavigate, onSearch }) => {
    const [inputValue, setInputValue] = useState(currentUrl);
    const [isSearchMode, setIsSearchMode] = useState(false);

    React.useEffect(() => {
        setInputValue(currentUrl);
    }, [currentUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        
        if (!trimmedValue) return;

        // Check if it's a URL or search term
        const isUrl = /^(https?:\/\/|www\.)/i.test(trimmedValue) || 
                     /\.(com|org|net|edu|gov|io|co|uk|de|fr|es|it|ru|jp|cn|in|br|au|ca)$/i.test(trimmedValue);
        
        if (isUrl) {
            onNavigate(trimmedValue);
        } else {
            onSearch(trimmedValue);
            setIsSearchMode(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setInputValue(currentUrl);
        }
    };

    const handleFocus = () => {
        setIsSearchMode(false);
    };

    return (
        <form className="address-bar" onSubmit={handleSubmit}>
            <div className="address-bar-icon">
                {isSearchMode ? '🔍' : '🌐'}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                placeholder="Enter URL or search term..."
                className="address-input"
                aria-label="Address bar for URL navigation and search"
            />
            <button type="submit" className="go-button">
                Go
            </button>
            <button 
                type="button" 
                className="clear-button"
                onClick={() => setInputValue('')}
                aria-label="Clear input"
            >
                ×
            </button>
        </form>
    );
};

export default AddressBar;