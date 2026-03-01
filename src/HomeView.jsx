// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { useEffect, useState } from 'react';
import supabase from '@/supabase-client';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!

function HomeView() {
  const [projs, setProjs] = useState([]);

  useEffect(() => {
    getProjs();
  }, []);

  async function getProjs() {
    const { data, error } = await supabase.from('projects').select();
    if (error) {
      console.log('Error: ', error);
    } else {
      setProjs(data || []);
    }
  }

  const [filterKeyword, setFilterKeyword] = useState('');

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
          className="border-gray-900 border-2 p-4 mb-4 mt-4 w-full"
          type="text"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          placeholder="Search by Project Name or Keyword..."
        />
      </div>

      {/* Reference for grid format: 
      https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd*/}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {projs
          .filter((proj) => {
            return filterKeyword.toLowerCase() === ''
              ? proj
              : proj.title.toLowerCase().includes(filterKeyword.toLowerCase());
          })
          .map((proj) => (
            <Card
              key={proj.id}
              image_link={proj.img_url}
              project_title={proj.title}
              tech_tags={proj.tech_tags ? proj.tech_tags.join(', ') : ''}
              project_link={proj.portal_url}
              ratings_link={`/review/${proj.id}`}
              complexity_rating={proj.avg_complexity ? proj.avg_complexity : 'N/A'}
              cooperation_rating={proj.avg_cooperation ? proj.avg_cooperation : 'N/A'}
              effort_rating={proj.avg_effort ? proj.avg_effort : 'N/A'}
              number_of_ratings={proj.review_count}
            />
          ))}
      </div>
    </div>
  );
}

export default HomeView;
