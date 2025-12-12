// backend/models/Comment.js
// Comment model and validation

const Joi = require('joi');
const crypto = require('crypto');

class Comment {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.url = data.url;
        this.urlHash = data.url_hash;
        this.comment = data.comment;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
        this.isFlagged = data.is_flagged;
        this.username = data.username; // Joined from users table
    }

    // Generate URL hash
    static generateUrlHash(url) {
        return crypto.createHash('sha256').update(url).digest('hex');
    }

    // Validation schema for new comments
    static get schema() {
        return Joi.object({
            url: Joi.string()
                .uri()
                .required()
                .messages({
                    'string.uri': 'Please enter a valid URL',
                    'any.required': 'URL is required'
                }),
            
            comment: Joi.string()
                .min(1)
                .max(1000)
                .required()
                .messages({
                    'string.min': 'Comment cannot be empty',
                    'string.max': 'Comment cannot exceed 1000 characters',
                    'any.required': 'Comment content is required'
                })
        });
    }

    // Validation schema for comment updates
    static get updateSchema() {
        return Joi.object({
            comment: Joi.string()
                .min(1)
                .max(1000)
                .required()
                .messages({
                    'string.min': 'Comment cannot be empty',
                    'string.max': 'Comment cannot exceed 1000 characters',
                    'any.required': 'Comment content is required'
                })
        });
    }

    // Validate new comment data
    static validate(data) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false
        });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return { isValid: false, errors };
        }
        
        return { isValid: true, data: value };
    }

    // Validate comment update data
    static validateUpdate(data) {
        const { error, value } = this.updateSchema.validate(data, {
            abortEarly: false
        });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return { isValid: false, errors };
        }
        
        return { isValid: true, data: value };
    }

    // Prepare comment for database insertion
    static prepareForInsert(userId, url, comment) {
        const urlHash = this.generateUrlHash(url);
        
        return {
            user_id: userId,
            url: url,
            url_hash: urlHash,
            comment: comment.trim(),
            created_at: new Date(),
            updated_at: new Date(),
            is_flagged: false
        };
    }

    // Check if comment can be edited (within 24 hours)
    canEdit() {
        const now = new Date();
        const createdAt = new Date(this.createdAt);
        const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
        
        return hoursDiff <= 24;
    }

    // Check if comment belongs to user
    belongsToUser(userId) {
        return this.userId === userId;
    }

    // Sanitize comment data for response
    toJSON() {
        const response = {
            id: this.id,
            user_id: this.userId,
            url: this.url,
            comment: this.comment,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            can_edit: this.canEdit(),
            is_flagged: this.isFlagged
        };

        // Include username if available
        if (this.username) {
            response.username = this.username;
        }

        return response;
    }

    // Format comment for display
    formatForDisplay() {
        const isEdited = this.createdAt !== this.updatedAt;
        const editNote = isEdited ? ' (edited)' : '';
        
        return {
            id: this.id,
            username: this.username || 'Anonymous',
            comment: this.comment,
            timestamp: new Date(this.createdAt).toLocaleString(),
            isEdited: isEdited,
            canEdit: this.canEdit(),
            belongsToCurrentUser: false // This would be set based on current user context
        };
    }
}

module.exports = Comment;