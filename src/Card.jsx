// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import "./App.css"

const Card = (props) => {
    const {projTitle, complexity, cooperation, effort, techTags, projLink, numRatings,ratingsLink, imageLink} = props;
    return (
        <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4">
            <img src={imageLink} />
            <br />
            <h2>
                <strong>{projTitle}</strong>
            </h2>
            <br />
            <p>Complexity: {complexity}/5 Stars</p>
            <br />
            <p>Cooperation: {cooperation}/5</p>
            <br />
            <p>Effort: {effort} Hours/Week</p>
            <br />
            <p>Tech Tags: {techTags}</p>
            <br />
            <a href={projLink} className="text-blue-500 underline">View Project on OSU Project Portal</a>
            <br />
            <a href={ratingsLink} className="text-blue-500 underline">View {numRatings} Student Ratings</a>
        </div>
    );
};

export default Card;
