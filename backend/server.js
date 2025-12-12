const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '', // Add your password if needed
    database: 'webbrowser_ratings',
    waitForConnections: true,
    connectionLimit: 10
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Simple auth endpoints
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username);
        
        // Mock login for now
        res.json({
            success: true,
            user: { id: 1, username, email: `${username}@example.com` },
            token: 'mock-jwt-token'
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Register attempt:', username, email);
        
        // Mock registration
        res.json({
            success: true,
            user: { id: 2, username, email },
            token: 'mock-jwt-token'
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Ratings endpoints
app.get('/api/ratings', async (req, res) => {
    try {
        const { url } = req.query;
        console.log('Get ratings for:', url);
        
        // Mock ratings
        res.json({
            average: 3.5,
            count: 10,
            userRating: null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get ratings' });
    }
});

app.post('/api/ratings', async (req, res) => {
    try {
        const { url, rating } = req.body;
        console.log('Save rating:', url, rating);
        
        res.json({ success: true, message: 'Rating saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

// Comments endpoints
app.get('/api/comments', async (req, res) => {
    try {
        const { url } = req.query;
        console.log('Get comments for:', url);
        
        // Mock comments
        res.json({
            comments: [
                { id: 1, username: 'User1', comment: 'Great website!', created_at: new Date().toISOString() },
                { id: 2, username: 'User2', comment: 'Very useful.', created_at: new Date().toISOString() }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get comments' });
    }
});

app.post('/api/comments', async (req, res) => {
    try {
        const { url, comment } = req.body;
        console.log('Save comment:', url, comment);
        
        res.json({ 
            success: true, 
            comment: {
                id: Date.now(),
                username: 'Current User',
                comment,
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save comment' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});