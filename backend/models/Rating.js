// backend/models/Rating.js
// Rating model and validation

const Joi = require('joi');
const crypto = require('crypto');

class Rating {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.url = data.url;
        this.urlHash = data.url_hash;
        this.domain = data.domain;
        this.rating = data.rating;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // Generate URL hash
    static generateUrlHash(url) {
        return crypto.createHash('sha256').update(url).digest('hex');
    }

    // Extract domain from URL
    static extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            // If URL parsing fails, try to extract domain manually
            const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
            return match ? match[1] : 'unknown';
        }
    }

    // Validation schema
    static get schema() {
        return Joi.object({
            url: Joi.string()
                .uri()
                .required()
                .messages({
                    'string.uri': 'Please enter a valid URL',
                    'any.required': 'URL is required'
                }),
            
            rating: Joi.number()
                .integer()
                .min(1)
                .max(5)
                .required()
                .messages({
                    'number.min': 'Rating must be at least 1',
                    'number.max': 'Rating cannot exceed 5',
                    'any.required': 'Rating is required'
                })
        });
    }

    // Validate rating data
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

    // Prepare rating for database insertion
    static prepareForInsert(userId, url, rating) {
        const urlHash = this.generateUrlHash(url);
        const domain = this.extractDomain(url);
        
        return {
            user_id: userId,
            url: url,
            url_hash: urlHash,
            domain: domain,
            rating: rating,
            created_at: new Date(),
            updated_at: new Date()
        };
    }

    // Calculate average rating from array of ratings
    static calculateAverage(ratings) {
        if (!ratings || ratings.length === 0) {
            return { average: 0, count: 0 };
        }
        
        const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
        const average = sum / ratings.length;
        
        return {
            average: parseFloat(average.toFixed(2)),
            count: ratings.length
        };
    }

    // Sanitize rating data for response
    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            url: this.url,
            domain: this.domain,
            rating: this.rating,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }

    // Create rating summary for a URL
    static createSummary(ratings, userRating = null) {
        const { average, count } = this.calculateAverage(ratings);
        
        return {
            average: average,
            count: count,
            distribution: this.calculateDistribution(ratings),
            user_rating: userRating
        };
    }

    // Calculate rating distribution
    static calculateDistribution(ratings) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        ratings.forEach(rating => {
            if (rating.rating >= 1 && rating.rating <= 5) {
                distribution[rating.rating]++;
            }
        });
        
        // Convert to percentages
        const total = ratings.length;
        if (total > 0) {
            for (let i = 1; i <= 5; i++) {
                distribution[i] = Math.round((distribution[i] / total) * 100);
            }
        }
        
        return distribution;
    }
}

module.exports = Rating;