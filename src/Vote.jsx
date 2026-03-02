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

    // SNAPSHOT PREVIOUS STATE (For Rollback)
    const prevUserVote = userVote;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // OPTIMISTIC UI UPDATE (Make it feel instant)
    if (userVote === targetVoteType) {
      // Scenario A: Toggling off the current vote
      setUserVote(null);
      if (targetVoteType === 'upvote') setUpvotes((prev) => prev - 1);
      if (targetVoteType === 'downvote') setDownvotes((prev) => prev - 1);
    } else {
      // Scenario B: Switching or adding a new vote
      setUserVote(targetVoteType);

      // Remove old vote counts if switching
      if (userVote === 'upvote') setUpvotes((prev) => prev - 1);
      if (userVote === 'downvote') setDownvotes((prev) => prev - 1);

      // Add new vote counts
      if (targetVoteType === 'upvote') setUpvotes((prev) => prev + 1);
      if (targetVoteType === 'downvote') setDownvotes((prev) => prev + 1);
    }

    // PERFORM BACKEND API CALLS
    try {
      const headers = await getAuthenticatedHeaders('vote');

      if (prevUserVote === targetVoteType) {
        // Removing an existing vote
        await apiFetch(`/votes/${reviewId}`, {
          method: 'DELETE',
          headers,
        });
      } else {
        // If switching, we MUST delete the old vote first
        if (prevUserVote) {
          await apiFetch(`/votes/${reviewId}`, {
            method: 'DELETE',
            headers,
          });
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
      }
    } catch (error) {
      // 4. ROLLBACK ON ERROR
      console.error('Voting failed, rolling back UI:', error);
      setUserVote(prevUserVote);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
      alert('Failed to register vote. Please try again.');
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
