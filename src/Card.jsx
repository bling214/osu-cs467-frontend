import "./App.css"

const Card = (props) => {
    const {projTitle, complexity, effort, techTags,projLink, numRatings,ratingsLink} = props;
    return (
        <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4">
            <p>
                <h2>
                    <strong>{projTitle}</strong>
                </h2>
                <div class="space"></div>
                <p>Complexity: {complexity}/5 Stars</p>
                <p>Effort: {effort} Hours/Week</p>
                <p>Tech Tags: TBD</p>
                <div class="space"></div>
                <a href={projLink} className="text-blue-500 underline">View Project Description</a>
                <div class="space"></div>
                <a href={ratingsLink} class="text-blue-500 underline">View {numRatings} Student Ratings</a>
            </p>   
        </div>
    );
};

export default Card;
