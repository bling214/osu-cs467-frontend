// Reference for react icons
// https://www.youtube.com/watch?v=R5xYw5kmh9k
// https://lucide.dev/guide/packages/lucide-react

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { apiFetch } from '@/utils/apiFetch';
import { getAuthenticatedHeaders } from '@/utils/auth';

const Vote = ({ reviewId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null }) => {
  const [userVote, setUserVote] = useState(initialUserVote); // 'upvote', 'downvote', or null
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (targetVoteType) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      // Authenticate and get JWT headers
      const headers = await getAuthenticatedHeaders('vote');

      // SCENARIO A: Removing an existing vote (clicking the same button twice)
      if (userVote === targetVoteType) {
        await apiFetch(`/votes/${reviewId}`, {
          method: 'DELETE',
          headers,
        });

        // Update UI visually
        if (targetVoteType === 'upvote') setUpvotes((prev) => prev - 1);
        if (targetVoteType === 'downvote') setDownvotes((prev) => prev - 1);
        setUserVote(null);
      }
      // SCENARIO B: Adding a new vote or switching votes
      else {
        // If switching (e.g., up to down), we MUST delete the old vote first
        if (userVote) {
          await apiFetch(`/votes/${reviewId}`, {
            method: 'DELETE',
            headers,
          });

          // Revert old UI state
          if (userVote === 'upvote') setUpvotes((prev) => prev - 1);
          if (userVote === 'downvote') setDownvotes((prev) => prev - 1);
        }

        // Post the new vote
        await apiFetch('/votes/', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            review_id: reviewId,
            vote_type: targetVoteType,
          }),
        });

        // Update UI visually for the new vote
        if (targetVoteType === 'upvote') setUpvotes((prev) => prev + 1);
        if (targetVoteType === 'downvote') setDownvotes((prev) => prev + 1);
        setUserVote(targetVoteType);
      }
    } catch (error) {
      console.error('Voting failed:', error);
      alert(error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote('upvote')}
        disabled={isVoting}
        className={`flex items-center text-green-600 ${isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 transition-transform'}`}
        aria-label="Upvote this review"
      >
        <ThumbsUp size={24} className={userVote === 'upvote' ? 'fill-current' : ''} />
        <span className="ml-1">{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote('downvote')}
        disabled={isVoting}
        className={`flex items-center text-red-600 ${isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 transition-transform'}`}
        aria-label="Downvote this review"
      >
        <ThumbsDown size={24} className={userVote === 'downvote' ? 'fill-current' : ''} />
        <span className="ml-1">{downvotes}</span>
      </button>
    </div>
  );
};

export default Vote;
