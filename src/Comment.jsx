import { useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import { debugLog } from '@/utils/logger';
import { getAuthenticatedHeaders } from '@/utils/auth';

const Comment = ({ reviewId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    const trimmedComment = comment.trim();

    // Client-Side Validation
    if (!trimmedComment) {
      alert('Please enter a comment.');
      return;
    }
    if (trimmedComment.length > 1000) {
      alert('Comment must be under 1000 characters.');
      return;
    }

    setLoading(true);

    try {
      // Lazy Authentication & Profile Initialization with Contextual Error Handling
      const headers = await getAuthenticatedHeaders('comment');

      // Construct Payload
      const payload = {
        review_id: reviewId,
        content: trimmedComment,
      };

      debugLog(`Submitting comment for review ID: ${payload.review_id}`);

      // Send to FastAPI Backend
      await apiFetch('/comments/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      debugLog('Comment submission API call succeeded.');
      alert('Comment submitted successfully!');
      setComment('');

      // Notify ReviewCard to re-fetch comments from database
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Comment Submission Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>
        <strong>Add Comment</strong>
      </h3>
      <div>
        <textarea
          className="w-full border border-border bg-card text-foreground rounded-lg p-4 h-32"
          placeholder="Write comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="text-right mt-2">
        <button
          type="button"
          onClick={submitComment}
          disabled={loading || !comment.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Comment'}
        </button>
      </div>
    </div>
  );
};

export default Comment;
