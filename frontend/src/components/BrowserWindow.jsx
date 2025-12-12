import React, { useState, useRef } from 'react';
import AddressBar from './AddressBar';

const BrowserWindow = ({ url, onNavigation, searchEngine }) => {
    const iframeRef = useRef(null);
    const [currentUrl, setCurrentUrl] = useState(url);
    const [isLoading, setIsLoading] = useState(false);
    const [iframeError, setIframeError] = useState(false);

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
            // Handle local route
            if (newUrl === '/local' || newUrl === '/local-test') {
                onNavigation('/local');
                return;
            }
            
            if (!newUrl.startsWith('http') && !newUrl.startsWith('/') && !newUrl.startsWith('about:')) {
                newUrl = 'https://' + newUrl;
            }
            setCurrentUrl(newUrl);
            setIframeError(false);
            onNavigation(newUrl);
        };
    const handleLoadStart = () => {
        setIsLoading(true);
        setIframeError(false);
    };

    const handleLoadEnd = () => {
        setIsLoading(false);
    };

    const getSandboxValue = () => {
        // For local files (same origin), we need different permissions
        if (currentUrl.startsWith('/') || currentUrl === 'about:blank') {
            // For truly local content, we can be more restrictive
            if (currentUrl === '/local-test.html') {
                return 'allow-scripts allow-same-origin';
            }
            // For other local files
            return 'allow-scripts';
        } else if (currentUrl.startsWith('about:')) {
            // about:blank and similar
            return 'allow-scripts allow-same-origin';
        } else {
            // External URLs - most restrictive
            return 'allow-scripts allow-popups allow-forms';
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #ddd'
            }}>
                <button
                    onClick={() => iframeRef.current?.contentWindow?.history?.back()}
                    style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Go Back"
                >
                    ←
                </button>
                <button
                    onClick={() => iframeRef.current?.contentWindow?.history?.forward()}
                    style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Go Forward"
                >
                    →
                </button>
                <button
                    onClick={() => iframeRef.current?.contentWindow?.location?.reload()}
                    style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Refresh"
                >
                    ↻
                </button>
                <button
                    onClick={() => navigateTo('/local-test.html')}
                    style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    title="Home"
                >
                    ⌂
                </button>
                
                <div style={{ flex: 1 }}>
                    <AddressBar
                        currentUrl={currentUrl}
                        onNavigate={navigateTo}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                {!iframeError ? (
                    <iframe
                        ref={iframeRef}
                        src={currentUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            display: iframeError ? 'none' : 'block'
                        }}
                        title="Web Browser"
                        onLoad={() => {
                            setIsLoading(false);
                            setIframeError(false);
                        }}
                        onError={() => {
                            setIsLoading(false);
                            setIframeError(true);
                        }}
                        sandbox={getSandboxValue()}
                        referrerPolicy="no-referrer-when-downgrade"
                />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>
                            Unable to Load Website
                        </h3>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            The website <strong>{currentUrl}</strong> cannot be displayed.<br/>
                            This may be due to security restrictions or network issues.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => window.open(currentUrl, '_blank')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Open in External Browser
                            </button>
                            <button
                                onClick={() => navigateTo('/local-test.html')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Return to Home
                            </button>
                            <button
                                onClick={() => {
                                    setIframeError(false);
                                    iframeRef.current?.contentWindow?.location?.reload();
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
                
                {isLoading && !iframeError && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '15px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        textAlign: 'center',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '10px',
                            verticalAlign: 'middle'
                        }}></div>
                        <span style={{ verticalAlign: 'middle', color: '#007bff' }}>
                            Loading {currentUrl}...
                        </span>
                    </div>
                )}
            </div>

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default BrowserWindow;