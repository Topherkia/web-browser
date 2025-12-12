// backend/middleware/authMiddleware.js
// Authentication middleware for JWT verification

const jwt = require('jsonwebtoken');

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required' 
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const user = jwt.verify(token, secret);
        
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token has expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        return res.status(403).json({ 
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
        });
    }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuthenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // No token, continue without authentication
        return next();
    }

    try {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const user = jwt.verify(token, secret);
        req.user = user;
    } catch (error) {
        // Invalid token, but we don't fail the request
        console.warn('Invalid token in optional authentication:', error.message);
    }
    
    next();
};

// Role-based authorization middleware
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Authentication required' 
            });
        }

        // Check if user has one of the allowed roles
        // This assumes your user object has a 'role' property
        if (allowedRoles.length > 0 && req.user.role) {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: 'Insufficient permissions' 
                });
            }
        }

        next();
    };
};

// Rate limiting per user middleware
const userRateLimit = (limit = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();

    return (req, res, next) => {
        const userId = req.user ? req.user.id : req.ip;
        const now = Date.now();
        
        if (!requests.has(userId)) {
            requests.set(userId, []);
        }

        const userRequests = requests.get(userId);
        
        // Clean old requests
        const windowStart = now - windowMs;
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= limit) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
            });
        }

        recentRequests.push(now);
        requests.set(userId, recentRequests);
        
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', limit - recentRequests.length);
        res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
        
        next();
    };
};

// Validate request body middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace request body with validated data
        req.body = value;
        next();
    };
};

module.exports = {
    authenticateToken,
    optionalAuthenticate,
    authorizeRole,
    userRateLimit,
    validateRequest
};