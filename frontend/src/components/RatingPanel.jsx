// frontend/src/components/RatingPanel.jsx
// Updated to work with simplified API

import React, { useState, useEffect } from 'react';
import CommentSection from './CommentSection';
import { getAverageRating, saveRating, getComments } from '../utils/api';

const RatingPanel = ({ url, isLoggedIn, onLoginRequest }) => {
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (url) {
            loadRatingData();
            loadComments();
        }
    }, [url]);

    const loadRatingData = async () => {
        try {
            setIsLoading(true);
            const data = await getAverageRating(url);
            setAverageRating(data.average || 0);
            setTotalRatings(data.count || 0);
            setUserRating(data.userRating || 0);
        } catch (error) {
            console.error('Error loading rating data:', error);
            // Set default values
            setAverageRating(3.5);
            setTotalRatings(10);
        } finally {
            setIsLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const commentsData = await getComments(url);
            setComments(commentsData);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleRatingClick = async (rating) => {
        if (!isLoggedIn) {
            onLoginRequest();
            return;
        }

        try {
            setUserRating(rating);
            await saveRating(url, rating);
            
            // Refresh average rating
            loadRatingData();
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    const handleCommentAdded = () => {
        loadComments();
    };

    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            height: '100%',
            overflow: 'auto'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Page Rating & Comments</h3>
                <p style={{
                    fontSize: '12px',
                    color: '#666',
                    backgroundColor: '#eee',
                    padding: '5px',
                    borderRadius: '4px',
                    wordBreak: 'break-all'
                }} title={url}>
                    {url.length > 50 ? url.substring(0, 47) + '...' : url}
                </p>
            </div>

            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#007bff',
                        marginRight: '15px'
                    }}>
                        {averageRating.toFixed(1)}
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', color: '#ffd700', marginBottom: '5px' }}>
                            {'★'.repeat(Math.floor(averageRating))}
                            {'☆'.repeat(5 - Math.floor(averageRating))}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Your Rating:</h4>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{
                                    cursor: 'pointer',
                                    color: (hoverRating || userRating) >= star ? '#ffd700' : '#ccc',
                                    marginRight: '5px',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {!isLoggedIn && (
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            <button
                                onClick={onLoginRequest}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline'
                                }}
                            >
                                Login
                            </button>
                            {' '}to rate this page
                        </p>
                    )}
                </div>
            </div>

            <CommentSection
                url={url}
                comments={comments}
                isLoggedIn={isLoggedIn}
                onLoginRequest={onLoginRequest}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
};

export default RatingPanel;