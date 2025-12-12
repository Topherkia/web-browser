// backend/database/database.js
// Database connection and queries for MariaDB/MySQL

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class Database {
    constructor() {
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3307,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'webbrowser_ratings',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            // Test connection
            const connection = await this.pool.getConnection();
            console.log('Connected to MariaDB database on port', process.env.DB_PORT || 3307);
            connection.release();
            
            return this.pool;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    async query(sql, params) {
        try {
            const [results] = await this.pool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async getUserByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
        const results = await this.query(sql, [username]);
        return results[0];
    }

    async createUser(username, email, passwordHash) {
        const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        const result = await this.query(sql, [username, email, passwordHash]);
        return result.insertId;
    }

    async saveRating(userId, url, urlHash, domain, rating) {
        const sql = `
            INSERT INTO webpage_ratings (user_id, url, url_hash, domain, rating) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP
        `;
        const result = await this.query(sql, [userId, url, urlHash, domain, rating]);
        return result;
    }

    async getAverageRating(urlHash) {
        const sql = 'SELECT AVG(rating) as average, COUNT(*) as count FROM webpage_ratings WHERE url_hash = ?';
        const results = await this.query(sql, [urlHash]);
        return results[0];
    }

    async addComment(userId, url, urlHash, comment) {
        const sql = 'INSERT INTO comments (user_id, url, url_hash, comment) VALUES (?, ?, ?, ?)';
        const result = await this.query(sql, [userId, url, urlHash, comment]);
        return result.insertId;
    }

    async getComments(urlHash, limit = 50) {
        const sql = `
            SELECT c.*, u.username 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.url_hash = ? AND c.is_flagged = FALSE 
            ORDER BY c.created_at DESC 
            LIMIT ?
        `;
        return await this.query(sql, [urlHash, limit]);
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            console.log('Database connection closed');
        }
    }
}

module.exports = new Database();