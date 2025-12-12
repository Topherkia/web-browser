// frontend/src/components/RatingPanel.jsx
// Rating and commenting panel for webpages

import React, { useState, useEffect } from 'react';
import CommentSection from './CommentSection';
import { getAverageRating, saveRating, getComments } from '../utils/api';
import '../styles/RatingPanel.css';

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
            
            // In a real app, check if user has rated this URL
            // For now, reset user rating when URL changes
            setUserRating(0);
        } catch (error) {
            console.error('Error loading rating data:', error);
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
            setUserRating(0);
        }
    };

    const handleCommentAdded = () => {
        loadComments();
    };

    const renderStars = (rating, interactive = false) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            let className = 'star';
            
            if (interactive) {
                className += ' interactive';
                if (starValue <= (hoverRating || userRating)) {
                    className += ' active';
                }
            } else {
                if (starValue <= rating) {
                    className += ' active';
                } else if (starValue - 0.5 <= rating) {
                    className += ' half-active';
                }
            }

            return (
                <span
                    key={index}
                    className={className}
                    onClick={interactive ? () => handleRatingClick(starValue) : undefined}
                    onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
                    onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    title={`${starValue} star${starValue !== 1 ? 's' : ''}`}
                >
                    {interactive ? '★' : (starValue <= rating ? '★' : '☆')}
                </span>
            );
        });
    };

    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="rating-panel">
            <div className="panel-header">
                <h3>Page Rating & Comments</h3>
                <div className="url-display" title={url}>
                    {url.length > 50 ? url.substring(0, 47) + '...' : url}
                </div>
            </div>

            <div className="rating-section">
                <div className="current-rating">
                    <div className="average-rating">
                        <div className="rating-number">{averageRating.toFixed(1)}</div>
                        <div className="stars-display">
                            {renderStars(averageRating)}
                        </div>
                        <div className="total-ratings">
                            ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
                        </div>
                    </div>
                </div>

                <div className="user-rating">
                    <h4>Your Rating:</h4>
                    <div className="stars-interactive">
                        {renderStars(userRating, true)}
                    </div>
                    {!isLoggedIn && (
                        <p className="login-prompt">
                            <button onClick={onLoginRequest} className="login-link">
                                Login
                            </button> to rate this page
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