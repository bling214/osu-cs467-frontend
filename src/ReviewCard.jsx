// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import Vote from "./Vote.jsx";
import Comment from "./Comment.jsx";

const ReviewCard = (props) => {
    const {complexity_rating, cooperation_rating, effort_rating, created_at_year, created_at_day, created_at_month, review_text, academic_year, academic_term, pseudonym} = props;
    
    return (
        <div>
            <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4 w-full">
                <p><strong>Academic Term:</strong> {academic_term} {academic_year}</p>
                <p><strong>Complexity Rating:</strong> {complexity_rating}/5</p>
                <p><strong>Cooperation Rating: </strong>{cooperation_rating}/5</p>
                <p><strong>Effort Rating:</strong> {effort_rating}/5</p>
                <br />
                <p>"{review_text}"</p>
                <br />
                <br />
                <p>Created on {created_at_month}/{created_at_day}/{created_at_year} by {pseudonym}</p>
                <br />
                <Vote />
                <br />
                <Comment />
            </div>
        </div>
            
    );
};

export default ReviewCard;
