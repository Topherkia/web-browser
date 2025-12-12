// backend/routes/ratingRoutes.js
// Rating routes

const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, optionalAuthenticate, validateRequest } = require('../middleware/authMiddleware');
const Rating = require('../models/Rating');

// Save or update a rating (protected)
router.post('/save',
    authenticateToken,
    validateRequest(Rating.schema),
    async (req, res, next) => {
        try {
            await ratingController.saveRating(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get rating for a URL (public, with optional authentication)
router.get('/get',
    optionalAuthenticate,
    async (req, res, next) => {
        try {
            await ratingController.getRating(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get user's rating history (protected)
router.get('/history',
    authenticateToken,
    async (req, res, next) => {
        try {
            await ratingController.getUserRatings(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Delete a rating (protected)
router.delete('/delete',
    authenticateToken,
    async (req, res, next) => {
        try {
            await ratingController.deleteRating(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get trending/popular pages (public)
router.get('/trending', async (req, res) => {
    try {
        const { limit = 10, timeframe = 'week' } = req.query;
        const database = require('../database/database');
        
        let timeCondition = '';
        const params = [parseInt(limit)];
        
        switch (timeframe) {
            case 'day':
                timeCondition = ' AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
                break;
            case 'week':
                timeCondition = ' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
                break;
            case 'month':
                timeCondition = ' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
                break;
        }
        
        const [trending] = await database.query(
            `SELECT 
                url,
                domain,
                AVG(rating) as average_rating,
                COUNT(*) as rating_count,
                COUNT(DISTINCT user_id) as unique_users
             FROM webpage_ratings 
             WHERE 1=1 ${timeCondition}
             GROUP BY url_hash, url, domain
             ORDER BY rating_count DESC, average_rating DESC
             LIMIT ?`,
            params
        );
        
        res.json({
            timeframe,
            trending,
            retrieved: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get trending error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching trending pages'
        });
    }
});

// Get highest rated pages (public)
router.get('/top-rated', async (req, res) => {
    try {
        const { limit = 10, minRatings = 5 } = req.query;
        const database = require('../database/database');
        
        const [topRated] = await database.query(
            `SELECT 
                url,
                domain,
                AVG(rating) as average_rating,
                COUNT(*) as rating_count
             FROM webpage_ratings 
             GROUP BY url_hash, url, domain
             HAVING rating_count >= ?
             ORDER BY average_rating DESC, rating_count DESC
             LIMIT ?`,
            [parseInt(minRatings), parseInt(limit)]
        );
        
        res.json({
            topRated,
            minRatings: parseInt(minRatings),
            retrieved: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get top-rated error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching top-rated pages'
        });
    }
});

// Get rating distribution for a URL (public)
router.get('/distribution/:urlHash', async (req, res) => {
    try {
        const { urlHash } = req.params;
        const database = require('../database/database');
        
        const [distribution] = await database.query(
            `SELECT 
                rating,
                COUNT(*) as count
             FROM webpage_ratings 
             WHERE url_hash = ?
             GROUP BY rating
             ORDER BY rating ASC`,
            [urlHash]
        );
        
        // Format distribution
        const total = distribution.reduce((sum, item) => sum + item.count, 0);
        const formattedDistribution = {};
        
        for (let i = 1; i <= 5; i++) {
            const item = distribution.find(d => d.rating === i);
            formattedDistribution[i] = {
                count: item ? item.count : 0,
                percentage: total > 0 ? Math.round((item ? item.count : 0) / total * 100) : 0
            };
        }
        
        res.json({
            url_hash: urlHash,
            distribution: formattedDistribution,
            total_ratings: total
        });
    } catch (error) {
        console.error('Get distribution error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching rating distribution'
        });
    }
});

module.exports = router;