// Reference for react icons
// https://www.youtube.com/watch?v=R5xYw5kmh9k
// https://lucide.dev/guide/packages/lucide-react

import React, {useState} from 'react';
import { ThumbsUp, ThumbsDown } from "lucide-react";

const Vote = () => {
    const [upVoteCounter, setUpVoteCounter] = useState(0);
    const [downVoteCounter, setDownVoteCounter] = useState(0);

    const upvote = () => {
        setUpVoteCounter(upVoteCounter + 1);
    }

    const downvote = () => {
        setDownVoteCounter(downVoteCounter + 1);
    };

    return (
        <div>
            <div >
                <button onClick={upvote} className="m-2 text-center fill-green-600 text-green-600"><ThumbsUp size={24} /></button>{upVoteCounter} 
                <button onClick={downvote} className="m-2 text-center fill-red-600 text-red-600"><ThumbsDown size={24} /></button>{downVoteCounter}
            </div>
        </div>
    );
};

export default Vote;