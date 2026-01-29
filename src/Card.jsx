// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import "./App.css"

const Card = (props) => {
    const {projTitle, complexity, effort, techTags,projLink, numRatings,ratingsLink, imageLink} = props;
    return (
        <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4">
            <img src={imageLink} />
            <div className="space"></div>
            <h2>
                <strong>{projTitle}</strong>
            </h2>
            
            <div className="space"></div>
            <p>Complexity: {complexity}/5 Stars</p>
            <p>Effort: {effort} Hours/Week</p>
            <p>Tech Tags: TBD</p>
            <div className="space"></div>
            <a href={projLink} className="text-blue-500 underline">View Project on OSU Project Portal</a>
            <div className="space"></div>
            <a href={ratingsLink} className="text-blue-500 underline">View {numRatings} Student Ratings</a>
        </div>
    );
};

export default Card;
