// backend/controllers/commentController.js
// Controller for comment operations

const crypto = require('crypto');
const database = require('../database/database');

class CommentController {
    // Helper function to generate URL hash
    generateUrlHash(url) {
        return crypto.createHash('sha256').update(url).digest('hex');
    }

    // Add a new comment
    async addComment(req, res) {
        try {
            const userId = req.user.id;
            const { url, comment } = req.body;

            if (!url || !comment) {
                return res.status(400).json({ 
                    error: 'URL and comment are required' 
                });
            }

            if (comment.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Comment cannot be empty' 
                });
            }

            if (comment.length > 1000) {
                return res.status(400).json({ 
                    error: 'Comment is too long (max 1000 characters)' 
                });
            }

            const urlHash = this.generateUrlHash(url);
            const commentId = await database.addComment(userId, url, urlHash, comment.trim());

            // Get the newly created comment with user info
            const [newComment] = await database.query(
                `SELECT c.*, u.username 
                 FROM comments c 
                 JOIN users u ON c.user_id = u.id 
                 WHERE c.id = ?`,
                [commentId]
            );

            res.status(201).json({
                message: 'Comment added successfully',
                comment: newComment
            });
        } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({ 
                error: 'Internal server error while adding comment' 
            });
        }
    }

    // Get comments for a URL
    async getComments(req, res) {
        try {
            const { url } = req.query;
            const { page = 1, limit = 50 } = req.query;
            const offset = (page - 1) * limit;

            if (!url) {
                return res.status(400).json({ 
                    error: 'URL parameter is required' 
                });
            }

            const urlHash = this.generateUrlHash(url);

            const comments = await database.query(
                `SELECT c.*, u.username 
                 FROM comments c 
                 JOIN users u ON c.user_id = u.id 
                 WHERE c.url_hash = ? AND c.is_flagged = FALSE 
                 ORDER BY c.created_at DESC 
                 LIMIT ? OFFSET ?`,
                [urlHash, parseInt(limit), offset]
            );

            // Get total count
            const [countResult] = await database.query(
                'SELECT COUNT(*) as total FROM comments WHERE url_hash = ? AND is_flagged = FALSE',
                [urlHash]
            );

            res.json({
                comments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                }
            });
        } catch (error) {
            console.error('Get comments error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching comments' 
            });
        }
    }

    // Get user's comments
    async getUserComments(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            const [comments] = await database.query(
                `SELECT c.*, u.username 
                 FROM comments c 
                 JOIN users u ON c.user_id = u.id 
                 WHERE c.user_id = ? 
                 ORDER BY c.created_at DESC 
                 LIMIT ? OFFSET ?`,
                [userId, parseInt(limit), offset]
            );

            // Get total count
            const [countResult] = await database.query(
                'SELECT COUNT(*) as total FROM comments WHERE user_id = ?',
                [userId]
            );

            res.json({
                comments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.total,
                    totalPages: Math.ceil(countResult.total / limit)
                }
            });
        } catch (error) {
            console.error('Get user comments error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching user comments' 
            });
        }
    }

    // Update a comment
    async updateComment(req, res) {
        try {
            const userId = req.user.id;
            const { commentId, comment } = req.body;

            if (!commentId || !comment) {
                return res.status(400).json({ 
                    error: 'Comment ID and content are required' 
                });
            }

            if (comment.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Comment cannot be empty' 
                });
            }

            if (comment.length > 1000) {
                return res.status(400).json({ 
                    error: 'Comment is too long (max 1000 characters)' 
                });
            }

            // Check if comment exists and belongs to user
            const [existingComment] = await database.query(
                'SELECT * FROM comments WHERE id = ? AND user_id = ?',
                [commentId, userId]
            );

            if (!existingComment) {
                return res.status(404).json({ 
                    error: 'Comment not found or access denied' 
                });
            }

            // Update comment
            await database.query(
                'UPDATE comments SET comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [comment.trim(), commentId]
            );

            // Get updated comment
            const [updatedComment] = await database.query(
                `SELECT c.*, u.username 
                 FROM comments c 
                 JOIN users u ON c.user_id = u.id 
                 WHERE c.id = ?`,
                [commentId]
            );

            res.json({
                message: 'Comment updated successfully',
                comment: updatedComment
            });
        } catch (error) {
            console.error('Update comment error:', error);
            res.status(500).json({ 
                error: 'Internal server error while updating comment' 
            });
        }
    }

    // Delete a comment
    async deleteComment(req, res) {
        try {
            const userId = req.user.id;
            const { commentId } = req.body;

            if (!commentId) {
                return res.status(400).json({ 
                    error: 'Comment ID is required' 
                });
            }

            // Check if comment exists and belongs to user
            const [existingComment] = await database.query(
                'SELECT * FROM comments WHERE id = ? AND user_id = ?',
                [commentId, userId]
            );

            if (!existingComment) {
                return res.status(404).json({ 
                    error: 'Comment not found or access denied' 
                });
            }

            // Delete comment (or mark as deleted in production)
            await database.query(
                'DELETE FROM comments WHERE id = ?',
                [commentId]
            );

            res.json({
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(500).json({ 
                error: 'Internal server error while deleting comment' 
            });
        }
    }
}

module.exports = new CommentController();