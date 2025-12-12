import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState('about:blank');
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'User1', text: 'Great website!', date: '2023-10-01' },
    { id: 2, user: 'User2', text: 'Very useful information.', date: '2023-10-02' }
  ]);

  const handleNavigate = () => {
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
      url = 'https://' + url;
    }
    setCurrentUrl(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
      alert(`Welcome ${username}!`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleRate = (stars) => {
    if (!isLoggedIn) {
      alert('Please login to rate pages');
      return;
    }
    setRating(stars);
    alert(`Rated ${stars} stars!`);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    
    if (!isLoggedIn) {
      alert('Please login to comment');
      return;
    }
    
    const newComment = {
      id: comments.length + 1,
      user: username,
      text: comment,
      date: new Date().toLocaleDateString()
    };
    
    setComments([newComment, ...comments]);
    setComment('');
    alert('Comment posted!');
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => handleRate(star)}
        style={{
          fontSize: '30px',
          color: star <= rating ? '#ffd700' : '#ccc',
          cursor: 'pointer',
          marginRight: '5px'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌐 Web Browser with Rating System</h1>
        <div className="auth-section">
          {isLoggedIn ? (
            <div>
              <span>Welcome, {username}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="login-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => alert('Registration would open here')}>Sign Up</button>
            </div>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="browser-section">
          <div className="browser-controls">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter URL..."
              className="url-input"
            />
            <button onClick={handleNavigate} className="go-btn">Go</button>
            <button onClick={() => setCurrentUrl('about:blank')} className="home-btn">Home</button>
          </div>
          
          <div className="browser-window">
            <iframe
              src={currentUrl}
              title="Web Browser"
              className="iframe"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>

        <div className="rating-section">
          <div className="rating-panel">
            <h3>⭐ Page Rating</h3>
            <p className="current-url">Current URL: {currentUrl}</p>
            
            <div className="rating-stars">
              <h4>Rate this page:</h4>
              <div className="stars">{renderStars()}</div>
              {!isLoggedIn && (
                <p className="login-prompt">Login to rate this page</p>
              )}
            </div>

            <div className="comments-section">
              <h4>💬 Comments ({comments.length})</h4>
              <div className="comment-form">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isLoggedIn ? "Add your comment..." : "Login to comment"}
                  rows="3"
                  disabled={!isLoggedIn}
                />
                <button 
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim() || !isLoggedIn}
                >
                  Post Comment
                </button>
              </div>
              
              <div className="comments-list">
                {comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      <strong>{c.user}</strong>
                      <span className="comment-date">{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;