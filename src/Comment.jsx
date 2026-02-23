import { useState } from "react";

const Comment = () => {
    const [comment, setComment] = useState(false);

    return (
        <div>
            <h3><strong>Add Comment</strong></h3>
            <div>
                <textarea 
                    className="w-full border border-gray-700 p-4 h-32" 
                    placeholder="Write comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} 
                />
            </div>
            <div className="text-right">
                <button type="button" className="bg-blue-500 text-white p-2 rounded" rows={10}>
                Comment
                </button>
            </div>
        </div>

    );
};

export default Comment;
