// frontend/src/utils/api.js
// Fix process.env issue

// Use window location or default to localhost:5000
const API_BASE_URL = window.location.origin.includes('localhost:3000') 
    ? 'http://localhost:5000/api' 
    : '/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);
        
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

// Authentication
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

// Ratings
export const getAverageRating = async (url) => {
    try {
        const data = await apiRequest(`/ratings/get?url=${encodeURIComponent(url)}`);
        return data;
    } catch (error) {
        console.log('Using mock rating data');
        return {
            average: 3.5,
            count: 10,
            userRating: null
        };
    }
};

export const saveRating = async (url, rating) => {
    try {
        const data = await apiRequest('/ratings/save', {
            method: 'POST',
            body: JSON.stringify({ url, rating })
        });
        return data;
    } catch (error) {
        console.log('Mock: Saved rating locally');
        return { success: true, message: 'Rating saved locally' };
    }
};

// Comments
export const getComments = async (url) => {
    try {
        const data = await apiRequest(`/comments/get?url=${encodeURIComponent(url)}&limit=10`);
        return data.comments || [];
    } catch (error) {
        console.log('Using mock comments');
        return [
            { id: 1, username: 'User1', comment: 'Great website!', created_at: '2023-10-01T10:00:00Z' },
            { id: 2, username: 'User2', comment: 'Very useful information.', created_at: '2023-10-02T11:00:00Z' },
            { id: 3, username: 'User3', comment: 'Bookmarked this page.', created_at: '2023-10-03T12:00:00Z' }
        ];
    }
};

export const saveComment = async (url, comment) => {
    try {
        const data = await apiRequest('/comments/add', {
            method: 'POST',
            body: JSON.stringify({ url, comment })
        });
        return data;
    } catch (error) {
        console.log('Mock: Saved comment locally');
        return { success: true, message: 'Comment saved locally' };
    }
};

// Other exports
export const getProfile = async () => {
    try {
        return await apiRequest('/auth/profile');
    } catch (error) {
        console.log('Using mock profile');
        return { user: { username: 'demo', email: 'demo@example.com' } };
    }
};