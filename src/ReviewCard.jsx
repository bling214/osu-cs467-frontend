// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import { useEffect, useState } from 'react';
import Vote from '@/Vote.jsx';
import Comment from '@/Comment.jsx';
import { apiFetch } from '@/utils/apiFetch';

const ReviewCard = (props) => {
  const {
    review_id,
    upvote_count,
    downvote_count,
    comment_count = 0,
    user_vote,
    complexity_rating,
    cooperation_rating,
    effort_rating,
    created_at_year,
    created_at_day,
    created_at_month,
    review_text,
    academic_year,
    academic_term,
    pseudonym,
  } = props;

  const [comments, setComments] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Local state to track the comment count so we can update it instantly
  const [localCommentCount, setLocalCommentCount] = useState(comment_count);

  // State to control whether the comment section is expanded
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Keep local count in sync just in case the parent component re-fetches data
  useEffect(() => {
    setLocalCommentCount(comment_count);
  }, [comment_count]);

  useEffect(() => {
    // ONLY fetch if the user has expanded the comments section
    if (!showComments) return;

    async function fetchComments() {
      setIsLoadingComments(true);
      try {
        const data = await apiFetch(`/comments/?review_id=${review_id}`);
        const fetchedComments = Array.isArray(data) ? data : [];
        setComments(fetchedComments);

        // Ensure our local count perfectly matches the database reality after fetching
        setLocalCommentCount(fetchedComments.length);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    }

    fetchComments();
  }, [review_id, refreshTrigger, showComments]); // Re-runs if user opens comments section or adds a new comment

  return (
    <div>
      <div className="bg-card text-foreground rounded-xl shadow-md border border-border p-5 w-full">
        <p>
          <strong>Academic Term:</strong> {academic_term} {academic_year}
        </p>
        <p>
          <strong>Complexity Rating:</strong> {complexity_rating}/5
        </p>
        <p>
          <strong>Cooperation Rating: </strong>
          {cooperation_rating}/5
        </p>
        <p>
          <strong>Effort Rating:</strong> {effort_rating}/5
        </p>
        <br />
        <p>"{review_text}"</p>
        <br />
        <br />
        <p className="text-sm text-muted-fg">
          Created on {created_at_month}/{created_at_day}/{created_at_year} by{' '}
          <span className={!pseudonym || pseudonym === 'Unknown' ? 'italic text-muted-fg' : 'font-semibold'}>
            {!pseudonym || pseudonym === 'Unknown' ? '[Deleted User]' : pseudonym}
          </span>
        </p>
        <br />

        <Vote
          reviewId={review_id}
          initialUpvotes={upvote_count}
          initialDownvotes={downvote_count}
          initialUserVote={user_vote}
        />

        <hr className="border-border my-4" />

        {/* --- LAZY LOADING TOGGLE BUTTON --- */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="text-primary hover:text-primary/80 text-sm font-semibold mb-4 flex items-center transition-colors"
        >
          {showComments ? 'Hide Comments' : `View / Add Comments (${localCommentCount})`}
        </button>

        {/* --- CONDITIONAL COMMENT RENDER --- */}
        {showComments && (
          <div className="mb-4 animate-fade-in">
            <h4 className="font-bold mb-4 text-lg border-b border-border pb-2">Comments ({localCommentCount})</h4>

            {isLoadingComments ? (
              <p className="text-sm text-muted-fg italic animate-pulse">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-fg italic mb-4">No comments yet. Be the first!</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {comments.map((c) => (
                  <li key={c.id} className="bg-tag-bg p-3 rounded shadow-sm border border-border">
                    <p className="text-sm">{c.content}</p>
                    <p className="text-xs text-muted-fg mt-1 text-right">
                      -{' '}
                      <span className={!c.pseudonym || c.pseudonym === 'Unknown' ? 'italic' : ''}>
                        {!c.pseudonym || c.pseudonym === 'Unknown' ? '[Deleted User]' : c.pseudonym}
                      </span>{' '}
                      on{' '}
                      {new Date(c.created_at).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short',
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Comment
              reviewId={review_id}
              onCommentAdded={() => {
                setRefreshTrigger((prev) => prev + 1);
                // Instantly optimistically update the count for a snappy UI
                setLocalCommentCount((prev) => prev + 1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
