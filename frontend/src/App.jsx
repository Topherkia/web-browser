// frontend/src/App.jsx
// Main App component

import React, { useState, useEffect } from 'react';
import BrowserWindow from './components/BrowserWindow';
import RatingPanel from './components/RatingPanel';
import LoginModal from './components/LoginModal';
import SearchEngineSelector from './components/SearchEngineSelector';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
    const [currentUrl, setCurrentUrl] = useState('/local'); // Changed from HTML file
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchEngine, setSearchEngine] = useState('google');

    const handleNavigation = (url) => {
        setCurrentUrl(url);
    };

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    };

        const renderContent = () => {
        if (currentUrl === '/local') {
            return <LocalTestPage />;
        } else if (currentUrl.startsWith('/')) {
            // Handle other local routes if needed
            return <LocalTestPage />;
        }}

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthProvider>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                fontFamily: 'Arial, sans-serif'
            }}>
                <header style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>Web Browser with Rating System</h1>
                    <div>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'white',
                                    color: '#007bff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'white',
                                    color: '#007bff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                </header>

                <div style={{
                    display: 'flex',
                    flex: 1,
                    padding: '20px',
                    gap: '20px',
                    overflow: 'hidden'
                }}>
                    <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <SearchEngineSelector
                            currentEngine={searchEngine}
                            onEngineChange={setSearchEngine}
                        />
                        {/*<BrowserWindow
                            url={currentUrl}
                            onNavigation={handleNavigation}
                            searchEngine={searchEngine}
                        />*/}
                        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <SearchEngineSelector
                                currentEngine={searchEngine}
                                onEngineChange={setSearchEngine}
                            />
                            {renderContent()}
                        </div>

                    </div>
                    
                    <div style={{ flex: 1, minWidth: '300px', overflowY: 'auto' }}>
                        <RatingPanel
                            url={currentUrl}
                            isLoggedIn={isLoggedIn}
                            onLoginRequest={() => setShowLoginModal(true)}
                        />
                    </div>
                </div>

                {showLoginModal && (
                    <LoginModal
                        onClose={() => setShowLoginModal(false)}
                        onLogin={handleLogin}
                    />
                )}
            </div>
        </AuthProvider>
    );
};

export default App;