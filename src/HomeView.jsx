// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!
import { SlidersHorizontal } from "lucide-react";
import supabase from '@/supabase-client';

const academicTerm = {
  1: "Winter",
  2: "Spring",
  3: "Summer",
  4: "Fall",
}

const complexityRanges = {
  1: '< 1.0',
  2: '1.0 - 2.0',
  3: '2.0 - 3.0',
  4: '3.0 - 4.0',
  5: '> 4.0',
};

const cooperationRanges = {
  1: '< 1.0',
  2: '1.0 - 2.0',
  3: '2.0 - 3.0',
  4: '3.0 - 4.0',
  5: '> 4.0',
};

const effortRanges = {
  1: '< 1.0',
  2: '1.0 - 2.0',
  3: '2.0 - 3.0',
  4: '3.0 - 4.0',
  5: '> 4.0',
};

function HomeView() {
  const [projs, setProjs] = useState([]);
  const [tags, setTags] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [openFilter, setOpenFilter] = useState(false);

  const toggleDropdown = () => {
    setOpenFilter(!openFilter);
  };

  useEffect(() => {
    async function getProjects() {
      try {
        const projData = await apiFetch('/projects/');
        setProjs(projData || []);
      } catch (error) {
        console.error('Error fetching project data from backend:', error);
      }
    }

    const getTags = async () => {
      const { data, error } = await supabase.from('projects').select("tech_tags");
      if (error) {
        console.log('Error: ', error);
      } else {
        const techTagList = data.flatMap(row => row.tech_tags);
        {/* Reference for creating a unique list and sorting a list without case sensitivity
          https://dmitripavlutin.com/javascript-merge-arrays/#:~:text=%2C%20'Superman'%5D;-,const%20villains%20=%20%5B'Joker'%2C%20'Bane'%5D;,//%20merge%20array2%20into%20array1
          https://coreui.io/blog/how-to-sort-an-array-of-objects-by-string-property-value-in-javascript/#:~:text=appear%20after%20b%20.-,Case%2DInsensitive%20Sorting,name))*/}
        const uniqueArray = [...new Set(techTagList)].sort((a, b) => {
          return a.localeCompare(b, undefined, { sensitivity: 'base' })
        });
        setTags(uniqueArray || []);
      }
    }

    const getAcademicYears = async () => {
      const { data, error } = await supabase.from('reviews').select('academic_year');
      if (error) {
        console.log('Error: ', error);
      } else {
        const academicYearList = data.map(term => term.academic_year);
        {/* Reference for creating a combined string array and sorting a list descending
          https://github.com/AnkitSharma-007/namaste-javascript-notes
          https://www.w3schools.com/jsref/jsref_sort.asp
          */}
        const uniqueTermArray = [...new Set(academicYearList)].sort().reverse();
        setAcademicYears(uniqueTermArray || []);
      }
    }
    getProjects()
    getTags();
    getAcademicYears();
  }, []); // Empty dependency array means this runs once on mount

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
      {/* More Filters Bar Section*/}
      <div>
        <button
          className="icon-button flex justify-end items-center border border-gray-400 p-1 rounded-lg bg-gray-700 text-white"
          onClick={toggleDropdown}>
          <SlidersHorizontal className="icon" />
          <span className="p-2">
            More Filters
          </span>
        </button>
        {openFilter && (
          <div className="flex absolute items-start mt-2 w-auto rounded-md shadow-lg focus:outline-none border border-gray-600 bg-gray-400 text-justify">
            <ul>
              <input
                type="checkbox"
                className="text-sm text-gray-700 m-2" />
              Tech Stack
              {tags.map((tag) => <li>
                <input
                  type="checkbox"
                  className="ml-10"
                /> {tag}</li>)}
            </ul>
            <ul>
              <input
                type="checkbox"
                className="text-sm text-gray-700 m-2"
              />
              Academic Years
              {academicYears.map((academicYear) => <li>
                <input type="checkbox" className="ml-10" /> {academicYear}</li>)}
            </ul>
            <ul>
              <input
                type="checkbox"
                className="text-sm text-gray-700 m-2"
              />
              Academic Terms
              {Object.keys(academicTerm).map((num) => (<li>
                <input
                  type="checkbox"
                  key="num"
                  value={academicTerm[num]}
                  className="ml-10" /> {academicTerm[num]}</li>))}
            </ul>
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Complexity Ranges
              {Object.keys(complexityRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {complexityRanges[num]}</li>))}
            </ul>
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Cooperation Ranges
              {Object.keys(cooperationRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {cooperationRanges[num]}</li>))}
            </ul>
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Effort Ranges
              {Object.keys(effortRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {effortRanges[num]}</li>))}
            </ul>
          </div>
        )}


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
