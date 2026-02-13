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

  const [selectKeyword, setSelectKeyword] = useState('');

  return (
    <div className="p-4">
        <div className="text-center mb-8">
        <Link to="/form" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
            Submit a Project Review
        </Link>
        </div>

        <div>
          {/* Reference for search filter:
          https://www.youtube.com/watch?v=xAqCEBFGdYk */}
        <input 
          className="border-gray-900 border-2 p-1 w-full"
          type="text"
          value={selectKeyword} 
          onChange={(e) => setSelectKeyword(e.target.value)} 
          placeholder="Search by Project Name or Keyword..."
        />
        </div>

      {/* Reference for grid format: 
      https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd*/}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
        {projs.filter((proj) => {
          return selectKeyword.toLowerCase() === '' ? proj : proj.title.toLowerCase().includes(selectKeyword);
        }).map((proj) => (
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
