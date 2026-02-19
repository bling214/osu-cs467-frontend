import { useState } from "react";

const Comment = () => {
    const [comment, setComment] = useState(false);

    return (
        <div>
            <h3><strong>Add Comment</strong></h3>
            <div>
                <textarea className="w-full border border-gray-700 p-4 h-30" placeholder="Write comment here..." />
            </div>
            <div className="text-right">
                <button className="bg-blue-500 text-white p-2 rounded" rows={10}>
                Comment
                </button>
            </div>
        </div>

    );
};

export default Comment;
