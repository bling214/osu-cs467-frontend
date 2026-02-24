// Reference for react icons
// https://www.youtube.com/watch?v=R5xYw5kmh9k
// https://lucide.dev/guide/packages/lucide-react

import {useState} from 'react';
import { ThumbsUp, ThumbsDown } from "lucide-react";

const Vote = ({initialUpvotes=0, initialDownvotes=0}) => {
    // Track the user's specific action.  Options are null, 'up', or 'down.
    const [userVote, setUserVote] = useState(null); 

    // Track total upvote and downvote for UI for now
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);

    const handleUpvote = () => {
        if (userVote === 'up') {
            // Disables/removes upvote if upvote is already selected
            setUpvotes(prev => prev - 1);
            setUserVote(null);
        } else {
            // Add upvote
            setUpvotes(prev => prev + 1);
            // Removes downvote if it existed
            if (userVote === 'down') setDownvotes(prev => prev - 1);
            setUserVote('up');
        }
    }
    
    const handleDownvote = () => {
        if (userVote === 'down') {
            // Disables/removes downvote if downvote is already selected
            setDownvotes(prev => prev - 1);
            setUserVote(null);
        } else {
            // Add downvote
            setDownvotes(prev => prev + 1);
            // Removes upvote if it existed
            if (userVote === 'up') setUpvotes(prev => prev - 1);
            setUserVote('down');
        }
    }


    return (
        <div className="flex items-center space-x-4">
            <button onClick={handleUpvote} className="flex items-center text-green-600">
                <ThumbsUp size={24} className={userVote === 'up' ? "fill-current" : ""}/>
                <span className="ml-1">{upvotes}</span>
            </button>
            <button onClick={handleDownvote} className="flex items-center text-red-600">
                <ThumbsDown size={24} className={userVote === 'down' ? "fill-current" : ""}/>
                <span className="ml-1">{downvotes}</span>
            </button>
        </div>

    );
};

export default Vote;
