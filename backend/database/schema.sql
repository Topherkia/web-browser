-- backend/database/schema.sql
-- Database schema for Web Browser Rating System
-- Compatible with both MySQL and MariaDB

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS webbrowser_ratings;
USE webbrowser_ratings;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Webpage ratings table
CREATE TABLE IF NOT EXISTS webpage_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    url_hash VARCHAR(64) NOT NULL,
    url TEXT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    rating TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_url (user_id, url_hash),
    CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    url_hash VARCHAR(64) NOT NULL,
    url TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_flagged BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    query TEXT NOT NULL,
    search_engine VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_url_hash ON webpage_ratings(url_hash);
CREATE INDEX IF NOT EXISTS idx_comments_url_hash ON comments(url_hash);
CREATE INDEX IF NOT EXISTS idx_user_ratings ON webpage_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);

-- Insert sample data for testing (optional)
INSERT IGNORE INTO users (username, email, password_hash) VALUES
('testuser', 'test@example.com', '$2a$10$TestHashForTestingPurposesOnly'),
('demo', 'demo@example.com', '$2a$10$AnotherTestHashForDemoUser');

-- Display table information
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'webbrowser_ratings'
ORDER BY 
    TABLE_NAME;