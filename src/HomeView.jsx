// References to help setup Supabase and React integration: 
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import Card from "./Card.jsx";
import { Link } from "react-router-dom"; // Use Link instead of <a> for speed!

function HomeView() {
  const [projs, setProjs] = useState([]);

  useEffect(() => {
    getProjs();
  }, []);

  async function getProjs() {
    const { data, error } = await supabase.from("projects").select();
    if (error) {
      console.log("Error: ", error);
    } else {
      setProjs(data || []);
    }
  }

  return (
    <div className="p-4">
        <div className="text-center mb-8">
        <Link to="/form" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
            Submit a Project Review
        </Link>
        </div>

      {/* Reference for grid format: 
      https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd*/}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        {projs.map((proj) => (
          <Card 
            key={proj.id}
            image_link={proj.img_url}
            project_title={proj.title} 
            complexity_rating="TBD"
            cooperation_rating="TBD"
            effort_rating="TBD"
            tech_tags={proj.tech_tags ? proj.tech_tags.join(', ') : ''}
            project_link={proj.portal_url}
            number_of_ratings="TBD"
            ratings_link="#"
          />
        ))}
      </div>
    </div>
  );
}

export default HomeView;
