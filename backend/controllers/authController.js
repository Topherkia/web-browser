// backend/controllers/authController.js
// Authentication controller for user login and registration

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../database/database');

class AuthController {
    // User registration
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({ 
                    error: 'Username, email, and password are required' 
                });
            }

            // Check if user already exists
            const existingUser = await database.getUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({ 
                    error: 'Username already exists' 
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Create user
            const userId = await database.createUser(username, email, passwordHash);

            // Generate JWT token
            const token = jwt.sign(
                { id: userId, username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: userId,
                    username,
                    email
                },
                token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                error: 'Internal server error during registration' 
            });
        }
    }

    // User login
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate input
            if (!username || !password) {
                return res.status(400).json({ 
                    error: 'Username and password are required' 
                });
            }

            // Find user
            const user = await database.getUserByUsername(username);
            if (!user) {
                return res.status(401).json({ 
                    error: 'Invalid username or password' 
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Invalid username or password' 
                });
            }

            // Update last login
            await database.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            // Remove password hash from response
            const { password_hash, ...userWithoutPassword } = user;

            res.json({
                message: 'Login successful',
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                error: 'Internal server error during login' 
            });
        }
    }

    // Get current user profile
    async getProfile(req, res) {
        try {
            // User ID is attached to req by auth middleware
            const userId = req.user.id;

            const [user] = await database.query(
                'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ 
                error: 'Internal server error' 
            });
        }
    }

    // Validate token (for frontend token validation)
    async validateToken(req, res) {
        try {
            // If middleware passes, token is valid
            res.json({ 
                valid: true, 
                user: req.user 
            });
        } catch (error) {
            res.status(401).json({ 
                valid: false, 
                error: 'Invalid token' 
            });
        }
    }
}

module.exports = new AuthController();