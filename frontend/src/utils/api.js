// frontend/src/utils/api.js
// API utility functions for backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include'
    };

    try {
        const response = await fetch(url, config);
        
        // Handle HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Authentication API calls
export const loginUser = async (username, password) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
};

export const registerUser = async (username, email, password) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
};

export const getProfile = async () => {
    return apiRequest('/auth/profile', {
        method: 'GET'
    });
};

export const validateToken = async () => {
    return apiRequest('/auth/validate', {
        method: 'POST'
    });
};

// Rating API calls
export const getAverageRating = async (url) => {
    return apiRequest(`/ratings/get?url=${encodeURIComponent(url)}`, {
        method: 'GET'
    });
};

export const saveRating = async (url, rating) => {
    return apiRequest('/ratings/save', {
        method: 'POST',
        body: JSON.stringify({ url, rating })
    });
};

export const getUserRatings = async (page = 1, limit = 20) => {
    return apiRequest(`/ratings/history?page=${page}&limit=${limit}`, {
        method: 'GET'
    });
};

export const deleteRating = async (url) => {
    return apiRequest('/ratings/delete', {
        method: 'DELETE',
        body: JSON.stringify({ url })
    });
};

export const getTrendingPages = async (limit = 10, timeframe = 'week') => {
    return apiRequest(`/ratings/trending?limit=${limit}&timeframe=${timeframe}`, {
        method: 'GET'
    });
};

export const getTopRatedPages = async (limit = 10, minRatings = 5) => {
    return apiRequest(`/ratings/top-rated?limit=${limit}&minRatings=${minRatings}`, {
        method: 'GET'
    });
};

// Comment API calls
export const getComments = async (url, page = 1, limit = 50) => {
    return apiRequest(`/comments/get?url=${encodeURIComponent(url)}&page=${page}&limit=${limit}`, {
        method: 'GET'
    });
};

export const saveComment = async (url, comment) => {
    return apiRequest('/comments/add', {
        method: 'POST',
        body: JSON.stringify({ url, comment })
    });
};

export const updateComment = async (commentId, comment) => {
    return apiRequest('/comments/update', {
        method: 'PUT',
        body: JSON.stringify({ commentId, comment })
    });
};

export const deleteComment = async (commentId) => {
    return apiRequest('/comments/delete', {
        method: 'DELETE',
        body: JSON.stringify({ commentId })
    });
};

export const getUserComments = async (page = 1, limit = 20) => {
    return apiRequest(`/comments/history?page=${page}&limit=${limit}`, {
        method: 'GET'
    });
};

export const getRecentComments = async (limit = 20) => {
    return apiRequest(`/comments/recent?limit=${limit}`, {
        method: 'GET'
    });
};

// Search API calls
export const saveSearchHistory = async (query, searchEngine) => {
    return apiRequest('/search/history', {
        method: 'POST',
        body: JSON.stringify({ query, searchEngine })
    });
};

export const getSearchHistory = async (page = 1, limit = 20) => {
    return apiRequest(`/search/history?page=${page}&limit=${limit}`, {
        method: 'GET'
    });
};

// Utility functions for URL handling
export const generateUrlHash = (url) => {
    // Simple hash function for client-side use
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        const char = url.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
};

export const extractDomain = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error) {
        const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
        return match ? match[1] : 'unknown';
    }
};

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

export const setCachedData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

export const clearCache = () => {
    cache.clear();
};

// Rate limiting helper
export const createRateLimiter = (limit, interval) => {
    const requests = new Map();
    
    return (key) => {
        const now = Date.now();
        const windowStart = now - interval;
        
        if (!requests.has(key)) {
            requests.set(key, []);
        }
        
        const userRequests = requests.get(key);
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= limit) {
            return false;
        }
        
        recentRequests.push(now);
        requests.set(key, recentRequests);
        return true;
    };
};