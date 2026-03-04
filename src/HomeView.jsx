// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!
import { Search, PenLine } from 'lucide-react';

function HomeView() {
  const [projs, setProjs] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');

  useEffect(() => {
    async function getProjs() {
      try {
        const data = await apiFetch('/projects/');
        setProjs(data || []);
      } catch (error) {
        console.error('Error fetching projects from backend:', error);
      }
    }

    getProjs();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      {/* Reference for search filter:
          https://www.youtube.com/watch?v=xAqCEBFGdYk */}
      <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
          <input
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Search by project name or keyword..."
          />
        </div>
        <Link
          to="/form"
          className="inline-flex items-center gap-2 bg-primary text-primary-fg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
        >
          <PenLine size={16} />
          Submit a Review
        </Link>
      </div>

      {/* Reference for grid format:
      https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd*/}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
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
              complexity_rating={proj.avg_complexity ?? 'N/A'}
              cooperation_rating={proj.avg_cooperation ?? 'N/A'}
              effort_rating={proj.avg_effort ?? 'N/A'}
              number_of_ratings={proj.review_count}
            />
          ))}
      </div>
    </div>
  );
}

export default HomeView;
