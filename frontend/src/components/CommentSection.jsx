// frontend/src/components/CommentSection.jsx
// Comment display and submission component

import React, { useState } from 'react';
import { saveComment } from '../utils/api';
import '../styles/CommentSection.css';

const CommentSection = ({ url, comments, isLoggedIn, onLoginRequest, onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (!isLoggedIn) {
            onLoginRequest();
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            
            await saveComment(url, newComment.trim());
            setNewComment('');
            onCommentAdded();
        } catch (err) {
            setError('Failed to submit comment. Please try again.');
            console.error('Error submitting comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comment-section">
            <div className="comment-header">
                <h4>Comments ({comments.length})</h4>
            </div>

            <form className="comment-form" onSubmit={handleSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => {
                        setNewComment(e.target.value);
                        setError('');
                    }}
                    placeholder={isLoggedIn ? "Add your comment about this webpage..." : "Login to add a comment"}
                    className="comment-input"
                    rows="3"
                    disabled={!isLoggedIn || isSubmitting}
                    maxLength="1000"
                />
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="comment-form-controls">
                    <div className="char-count">
                        {newComment.length}/1000
                    </div>
                    <button
                        type="submit"
                        disabled={!newComment.trim() || !isLoggedIn || isSubmitting}
                        className="submit-button"
                    >
                        {isSubmitting ? 'Submitting...' : 'Post Comment'}
                    </button>
                </div>
            </form>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <span className="author-avatar">
                                        {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                    <span className="author-name">{comment.username || 'Anonymous'}</span>
                                </div>
                                <div className="comment-date">
                                    {formatDate(comment.created_at)}
                                </div>
                            </div>
                            <div className="comment-content">
                                {comment.comment}
                            </div>
                            {comment.updated_at !== comment.created_at && (
                                <div className="comment-edited">
                                    (edited)
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;