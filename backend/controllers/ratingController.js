// backend/controllers/ratingController.js
// Controller for webpage rating operations

const crypto = require('crypto');
const database = require('../database/database');

class RatingController {
    // Helper function to generate URL hash
    generateUrlHash(url) {
        return crypto.createHash('sha256').update(url).digest('hex');
    }

    // Helper function to extract domain from URL
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            // If URL parsing fails, try to extract domain manually
            const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
            return match ? match[1] : 'unknown';
        }
    }

    // Save or update a rating
    async saveRating(req, res) {
        try {
            const userId = req.user.id;
            const { url, rating } = req.body;

            if (!url || !rating) {
                return res.status(400).json({ 
                    error: 'URL and rating are required' 
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    error: 'Rating must be between 1 and 5' 
                });
            }

            const urlHash = this.generateUrlHash(url);
            const domain = this.extractDomain(url);

            await database.saveRating(userId, url, urlHash, domain, rating);

            // Get updated average
            const averageData = await database.getAverageRating(urlHash);

            res.json({
                message: 'Rating saved successfully',
                rating: {
                    url,
                    rating,
                    average: parseFloat(averageData.average) || 0,
                    count: averageData.count || 0
                }
            });
        } catch (error) {
            console.error('Save rating error:', error);
            res.status(500).json({ 
                error: 'Internal server error while saving rating' 
            });
        }
    }

    // Get average rating for a URL
    async getRating(req, res) {
        try {
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({ 
                    error: 'URL parameter is required' 
                });
            }

            const urlHash = this.generateUrlHash(url);
            const averageData = await database.getAverageRating(urlHash);

            // Check if user has rated this URL
            let userRating = null;
            if (req.user) {
                const [userRatingData] = await database.query(
                    'SELECT rating FROM webpage_ratings WHERE user_id = ? AND url_hash = ?',
                    [req.user.id, urlHash]
                );
                userRating = userRatingData ? userRatingData.rating : null;
            }

            res.json({
                url,
                average: parseFloat(averageData.average) || 0,
                count: averageData.count || 0,
                userRating
            });
        } catch (error) {
            console.error('Get rating error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching rating' 
            });
        }
    }

    // Get user's rating history
    async getUserRatings(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const [ratings] = await database.query(
                `SELECT url, rating, domain, created_at, updated_at 
                 FROM webpage_ratings 
                 WHERE user_id = ? 
                 ORDER BY updated_at DESC 
                 LIMIT ? OFFSET ?`,
                [userId, parseInt(limit), offset]
            );

            // Get total count
            const [countResult] = await database.query(
                'SELECT COUNT(*) as total FROM webpage_ratings WHERE user_id = ?',
                [userId]
            );

            res.json({
                ratings,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                }
            });
        } catch (error) {
            console.error('Get user ratings error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching user ratings' 
            });
        }
    }

    // Delete a rating
    async deleteRating(req, res) {
        try {
            const userId = req.user.id;
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ 
                    error: 'URL is required' 
                });
            }

            const urlHash = this.generateUrlHash(url);

            const result = await database.query(
                'DELETE FROM webpage_ratings WHERE user_id = ? AND url_hash = ?',
                [userId, urlHash]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'Rating not found' 
                });
            }

            res.json({
                message: 'Rating deleted successfully'
            });
        } catch (error) {
            console.error('Delete rating error:', error);
            res.status(500).json({ 
                error: 'Internal server error while deleting rating' 
            });
        }
    }
}

module.exports = new RatingController();