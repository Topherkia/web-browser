import { Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { useState, useEffect } from 'react';
import { Separator } from '@/app/components/ui/separator';

export interface Rating {
  stars: number;
  count: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  rating: number;
}

interface WebsiteReviewData {
  url: string;
  rating: Rating;
  comments: Comment[];
  userRating?: number;
}

interface RatingCommentsProps {
  url: string;
}

// Helper functions for localStorage
const getReviewsForUrl = (url: string): WebsiteReviewData => {
  const stored = localStorage.getItem(`reviews_${url}`);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    url,
    rating: { stars: 0, count: 0 },
    comments: [],
  };
};

const saveReviewsForUrl = (data: WebsiteReviewData) => {
  localStorage.setItem(`reviews_${data.url}`, JSON.stringify(data));
};

export function RatingComments({ url }: RatingCommentsProps) {
  const [reviewData, setReviewData] = useState<WebsiteReviewData>(() =>
    getReviewsForUrl(url)
  );
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const data = getReviewsForUrl(url);
    setReviewData(data);
    setCommentText('');
  }, [url]);

  const handleRating = (stars: number) => {
    const newData = { ...reviewData };
    
    // If user already rated, update the average
    if (newData.userRating) {
      const oldTotal = newData.rating.stars * newData.rating.count;
      const newTotal = oldTotal - newData.userRating + stars;
      newData.rating.stars = newTotal / newData.rating.count;
    } else {
      // New rating
      const oldTotal = newData.rating.stars * newData.rating.count;
      newData.rating.count += 1;
      newData.rating.stars = (oldTotal + stars) / newData.rating.count;
    }
    
    newData.userRating = stars;
    setReviewData(newData);
    saveReviewsForUrl(newData);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName.trim() || 'Anonymous',
      text: commentText.trim(),
      timestamp: Date.now(),
      rating: reviewData.userRating || 0,
    };

    const newData = {
      ...reviewData,
      comments: [newComment, ...reviewData.comments],
    };

    setReviewData(newData);
    saveReviewsForUrl(newData);
    setCommentText('');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && handleRating(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? hoverRating || reviewData.userRating || 0 : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!url || url === 'home') {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-6">
        <p>Navigate to a website to see ratings and comments</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-6">
          <h3 className="text-lg mb-2">Rate this website</h3>
          <div className="flex items-center gap-4 mb-4">
            {renderStars(reviewData.userRating || 0, true)}
            {reviewData.userRating && (
              <span className="text-sm text-gray-600">
                You rated {reviewData.userRating} star{reviewData.userRating !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {reviewData.rating.count > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {renderStars(Math.round(reviewData.rating.stars))}
              <span>
                {reviewData.rating.stars.toFixed(1)} ({reviewData.rating.count} rating
                {reviewData.rating.count !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg mb-4">Leave a comment</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
            <Textarea
              placeholder="Share your thoughts about this website..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
              Post Comment
            </Button>
          </div>
        </Card>

        {reviewData.comments.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg mb-4">
              Comments ({reviewData.comments.length})
            </h3>
            <div className="space-y-4">
              {reviewData.comments.map((comment, index) => (
                <div key={comment.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span>{comment.author}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    {comment.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(comment.rating)}
                      </div>
                    )}
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
