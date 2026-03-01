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
  // Create a simple counter state to act as our refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await apiFetch(`/comments/?review_id=${review_id}`);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
    fetchComments();
  }, [review_id, refreshTrigger]); // The effect runs whenever the ID or the trigger changes!

  return (
    <div>
      <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4 w-full">
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
        <p className="text-sm text-gray-600">
          Created on {created_at_month}/{created_at_day}/{created_at_year} by{' '}
          <span className={!pseudonym || pseudonym === 'Unknown' ? 'italic text-gray-400' : 'font-semibold'}>
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

        <hr className="border-gray-400 my-4" />

        <div className="mb-4">
          <h4 className="font-bold mb-2">Comments ({comments.length})</h4>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No comments yet. Be the first!</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="bg-white p-3 rounded shadow-sm border border-gray-300">
                  <p className="text-sm">{c.content}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
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
        </div>

        {/* Tell the Comment component to simply increment the trigger on success */}
        <Comment reviewId={review_id} onCommentAdded={() => setRefreshTrigger((prev) => prev + 1)} />
      </div>
    </div>
  );
};

export default ReviewCard;
