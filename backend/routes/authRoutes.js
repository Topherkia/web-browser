// backend/routes/authRoutes.js
// Authentication routes

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, validateRequest } = require('../middleware/authMiddleware');
const User = require('../models/User');

// User registration
router.post('/register', 
    validateRequest(User.registrationSchema),
    async (req, res, next) => {
        try {
            await authController.register(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// User login
router.post('/login',
    validateRequest(User.loginSchema),
    async (req, res, next) => {
        try {
            await authController.login(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get current user profile (protected)
router.get('/profile',
    authenticateToken,
    async (req, res, next) => {
        try {
            await authController.getProfile(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Validate token (protected)
router.post('/validate',
    authenticateToken,
    async (req, res, next) => {
        try {
            await authController.validateToken(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Logout (client-side token destruction)
router.post('/logout',
    authenticateToken,
    (req, res) => {
        // Note: JWT tokens are stateless, so logout is handled client-side
        // by removing the token from storage
        res.json({
            message: 'Logout successful. Please remove the token from client storage.'
        });
    }
);

// Check username availability
router.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username || username.length < 3) {
            return res.status(400).json({
                available: false,
                message: 'Username must be at least 3 characters'
            });
        }

        const database = require('../database/database');
        const existingUser = await database.getUserByUsername(username);
        
        res.json({
            available: !existingUser,
            message: existingUser ? 'Username already taken' : 'Username available'
        });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({
            available: false,
            message: 'Server error checking username availability'
        });
    }
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                available: false,
                message: 'Email is required'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                available: false,
                message: 'Invalid email format'
            });
        }

        const database = require('../database/database');
        const [existingUser] = await database.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        res.json({
            available: !existingUser,
            message: existingUser ? 'Email already registered' : 'Email available'
        });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({
            available: false,
            message: 'Server error checking email availability'
        });
    }
});

module.exports = router;