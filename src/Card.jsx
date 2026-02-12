// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import { UNSAFE_getTurboStreamSingleFetchDataStrategy } from "react-router-dom";

const Card = (props) => {
    const {project_title, complexity_rating, cooperation_rating, effort_rating, tech_tags, project_link, number_of_ratings,ratings_link, image_link} = props;
    return (
        <div className="bg-gray-200 m-3 border-2 border-gray-700 p-4">
            <img src={image_link} />
            <br />
            <h2>
                <strong>{project_title}</strong>
            </h2>
            <br />
            <p>Complexity Rating: {complexity_rating}/5</p>
            <br />
            <p>Cooperation Rating: {cooperation_rating}/5</p>
            <br />
            <p>Effort Rating: {effort_rating}/5</p>
            <br />
            <p>Tech Tags: {tech_tags.length>0 ? tech_tags : "None"}</p>
            <br />
            <a href={project_link} className="text-blue-500 underline">View Project on OSU Project Portal</a>
            <br />
            <a href={ratings_link} className="text-blue-500 underline">View {number_of_ratings} Student Ratings</a>
        </div>
    );
};

export default Card;
