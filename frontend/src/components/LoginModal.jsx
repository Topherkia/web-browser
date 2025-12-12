// frontend/src/components/LoginModal.jsx
// Login and signup modal component

import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/api';
import '../styles/LoginModal.css';

const LoginModal = ({ onClose, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (isLoginMode) {
            if (!formData.username.trim() || !formData.password) {
                setError('Username and password are required');
                return false;
            }
        } else {
            if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
                setError('All fields are required');
                return false;
            }
            
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
            
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError('Please enter a valid email address');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            let userData;
            if (isLoginMode) {
                userData = await loginUser(formData.username, formData.password);
            } else {
                userData = await registerUser(
                    formData.username,
                    formData.email,
                    formData.password
                );
            }

            onLogin(userData);
            onClose();
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                
                <div className="modal-header">
                    <h2>{isLoginMode ? 'Login' : 'Create Account'}</h2>
                    <p>{isLoginMode ? 'Sign in to rate and comment on webpages' : 'Create a new account to get started'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button" 
                            onClick={switchMode}
                            className="switch-mode-button"
                        >
                            {isLoginMode ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>

                <div className="modal-info">
                    <p className="info-note">
                        Your account allows you to:
                    </p>
                    <ul>
                        <li>Rate any webpage from 1-5 stars</li>
                        <li>Add comments to webpages</li>
                        <li>View your rating history</li>
                        <li>Participate in community discussions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;