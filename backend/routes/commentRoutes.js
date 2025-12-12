// backend/routes/commentRoutes.js
// Comment routes

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, validateRequest } = require('../middleware/authMiddleware');
const Comment = require('../models/Comment');

// Add a new comment (protected)
router.post('/add',
    authenticateToken,
    validateRequest(Comment.schema),
    async (req, res, next) => {
        try {
            await commentController.addComment(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get comments for a URL (public)
router.get('/get',
    async (req, res, next) => {
        try {
            await commentController.getComments(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get user's comments (protected)
router.get('/history',
    authenticateToken,
    async (req, res, next) => {
        try {
            await commentController.getComments(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Update a comment (protected)
router.put('/update',
    authenticateToken,
    validateRequest(Comment.updateSchema),
    async (req, res, next) => {
        try {
            await commentController.updateComment(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Delete a comment (protected)
router.delete('/delete',
    authenticateToken,
    async (req, res, next) => {
        try {
            await commentController.deleteComment(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Get recent comments across all pages (public)
router.get('/recent', async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const database = require('../database/database');
        
        const [recentComments] = await database.query(
            `SELECT 
                c.id,
                c.url,
                c.comment,
                c.created_at,
                u.username,
                COUNT(cr.id) as reply_count
             FROM comments c
             JOIN users u ON c.user_id = u.id
             LEFT JOIN comments cr ON cr.parent_comment_id = c.id
             WHERE c.is_flagged = FALSE
             GROUP BY c.id
             ORDER BY c.created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );
        
        res.json({
            recentComments,
            retrieved: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get recent comments error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching recent comments'
        });
    }
});

// Get comment statistics for a URL (public)
router.get('/stats/:urlHash', async (req, res) => {
    try {
        const { urlHash } = req.params;
        const database = require('../database/database');
        
        const [stats] = await database.query(
            `SELECT 
                COUNT(*) as total_comments,
                COUNT(DISTINCT user_id) as unique_users,
                MIN(created_at) as first_comment,
                MAX(created_at) as last_comment
             FROM comments 
             WHERE url_hash = ? AND is_flagged = FALSE`,
            [urlHash]
        );
        
        res.json({
            url_hash: urlHash,
            statistics: stats[0] || {
                total_comments: 0,
                unique_users: 0,
                first_comment: null,
                last_comment: null
            }
        });
    } catch (error) {
        console.error('Get comment stats error:', error);
        res.status(500).json({
            error: 'Internal server error while fetching comment statistics'
        });
    }
});

// Flag a comment (protected)
router.post('/flag/:commentId',
    authenticateToken,
    async (req, res) => {
        try {
            const { commentId } = req.params;
            const database = require('../database/database');
            
            // Check if comment exists
            const [comment] = await database.query(
                'SELECT * FROM comments WHERE id = ?',
                [commentId]
            );
            
            if (!comment) {
                return res.status(404).json({
                    error: 'Comment not found'
                });
            }
            
            // Update comment as flagged
            await database.query(
                'UPDATE comments SET is_flagged = TRUE WHERE id = ?',
                [commentId]
            );
            
            res.json({
                message: 'Comment flagged for review',
                commentId
            });
        } catch (error) {
            console.error('Flag comment error:', error);
            res.status(500).json({
                error: 'Internal server error while flagging comment'
            });
        }
    }
);

module.exports = router;