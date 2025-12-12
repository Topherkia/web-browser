// frontend/src/components/BrowserWindow.jsx
// Browser window component with webview and navigation controls

import React, { useState, useRef, useEffect } from 'react';
import AddressBar from './AddressBar';
import '../styles/BrowserWindow.css';

const BrowserWindow = ({ url, onNavigation, searchEngine }) => {
    const webviewRef = useRef(null);
    const [currentUrl, setCurrentUrl] = useState(url);
    const [isLoading, setIsLoading] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const searchEngines = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        yahoo: 'https://search.yahoo.com/search?p='
    };

    const handleSearch = (query) => {
        if (query.trim()) {
            const searchUrl = searchEngines[searchEngine] + encodeURIComponent(query);
            navigateTo(searchUrl);
        }
    };

    const navigateTo = (newUrl) => {
        if (!newUrl.startsWith('http')) {
            newUrl = 'https://' + newUrl;
        }
        setCurrentUrl(newUrl);
        onNavigation(newUrl);
    };

    const handleGoBack = () => {
        if (webviewRef.current && canGoBack) {
            webviewRef.current.goBack();
        }
    };

    const handleGoForward = () => {
        if (webviewRef.current && canGoForward) {
            webviewRef.current.goForward();
        }
    };

    const handleRefresh = () => {
        if (webviewRef.current) {
            webviewRef.current.reload();
        }
    };

    const handleHome = () => {
        navigateTo('https://www.google.com');
    };

    return (
        <div className="browser-window">
            <div className="browser-controls">
                <button 
                    onClick={handleGoBack} 
                    disabled={!canGoBack}
                    className="nav-btn"
                >
                    ←
                </button>
                <button 
                    onClick={handleGoForward} 
                    disabled={!canGoForward}
                    className="nav-btn"
                >
                    →
                </button>
                <button onClick={handleRefresh} className="nav-btn">
                    ↻
                </button>
                <button onClick={handleHome} className="nav-btn">
                    ⌂
                </button>
                
                <AddressBar 
                    currentUrl={currentUrl}
                    onNavigate={navigateTo}
                    onSearch={handleSearch}
                />
            </div>

            <div className="webview-container">
                {isLoading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <span>Loading...</span>
                    </div>
                )}
                
                <webview
                    ref={webviewRef}
                    src={currentUrl}
                    className="webview"
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    onDidStartLoading={() => setIsLoading(true)}
                    onDidStopLoading={() => setIsLoading(false)}
                    onDidNavigate={(event) => {
                        setCurrentUrl(event.url);
                        onNavigation(event.url);
                    }}
                    onUpdateTargetUrl={(event) => {
                        // Update address bar with hovered links
                        console.log('Hovering over:', event.url);
                    }}
                />
            </div>
        </div>
    );
};

export default BrowserWindow;