// backend/models/User.js
// User model and validation

const Joi = require('joi');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.passwordHash = data.password_hash;
        this.createdAt = data.created_at;
        this.lastLogin = data.last_login;
        this.isActive = data.is_active;
    }

    // Validation schema for registration
    static get registrationSchema() {
        return Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.alphanum': 'Username must contain only alphanumeric characters',
                    'string.min': 'Username must be at least 3 characters long',
                    'string.max': 'Username cannot exceed 30 characters',
                    'any.required': 'Username is required'
                }),
            
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'any.required': 'Email is required'
                }),
            
            password: Joi.string()
                .min(6)
                .required()
                .messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'any.required': 'Password is required'
                }),
            
            confirmPassword: Joi.string()
                .valid(Joi.ref('password'))
                .required()
                .messages({
                    'any.only': 'Passwords do not match',
                    'any.required': 'Please confirm your password'
                })
        });
    }

    // Validation schema for login
    static get loginSchema() {
        return Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        });
    }

    // Validate registration data
    static validateRegistration(data) {
        const { error, value } = this.registrationSchema.validate(data, {
            abortEarly: false
        });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return { isValid: false, errors };
        }
        
        return { isValid: true, data: value };
    }

    // Validate login data
    static validateLogin(data) {
        const { error, value } = this.loginSchema.validate(data, {
            abortEarly: false
        });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return { isValid: false, errors };
        }
        
        return { isValid: true, data: value };
    }

    // Sanitize user data for response
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            created_at: this.createdAt,
            last_login: this.lastLogin,
            is_active: this.isActive
        };
    }

    // Check if password is valid
    async validatePassword(password, bcrypt) {
        return await bcrypt.compare(password, this.passwordHash);
    }
}

module.exports = User;