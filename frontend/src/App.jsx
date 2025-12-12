// frontend/src/App.jsx
// Main React component for the Web Browser application

import React, { useState, useEffect } from 'react';
import BrowserWindow from './components/BrowserWindow';
import RatingPanel from './components/RatingPanel';
import LoginModal from './components/LoginModal';
import SearchEngineSelector from './components/SearchEngineSelector';
import { AuthProvider } from './contexts/AuthContext';
import './styles/App.css';

const App = () => {
    const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
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

    useEffect(() => {
        // Check if user is already logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthProvider>
            <div className="app-container">
                <header className="app-header">
                    <h1>Web Browser with Rating System</h1>
                    <div className="user-controls">
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        ) : (
                            <button onClick={() => setShowLoginModal(true)} className="login-btn">
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                </header>

                <div className="main-content">
                    <div className="browser-section">
                        <SearchEngineSelector 
                            currentEngine={searchEngine}
                            onEngineChange={setSearchEngine}
                        />
                        <BrowserWindow 
                            url={currentUrl}
                            onNavigation={handleNavigation}
                            searchEngine={searchEngine}
                        />
                    </div>
                    
                    <div className="rating-section">
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