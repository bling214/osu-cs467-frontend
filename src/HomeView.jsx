// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM
// Reference to help with filtering capability
// https://www.tutorialspoint.com/how-to-use-checkboxes-in-reactjs#:~:text=In%20the%20handleChange()%20function%2C%20we%20check%20if%20the%20checkbox,target.
// https://coreui.io/answers/how-to-filter-a-list-in-react/#:~:text=Implementing%20filtering%20functionality%20allows%20users,searchTerm.
// https://www.youtube.com/watch?v=jN_s2uKntmc


import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!
import { ChartNoAxesColumnDecreasing, SlidersHorizontal } from "lucide-react";
import supabase from '@/supabase-client';
import { select } from '@material-tailwind/react';

const academicTerm = {
  1: "Winter",
  2: "Spring",
  3: "Summer",
  4: "Fall",
}

const complexityRanges = [
  {id: 1, label: '< 1.0', min: 0, max: 1},
  {id: 2, label: '1.0 - 2.0', min: 1, max: 2},
  {id: 3, label: '2.0 - 3.0', min: 2, max: 3},
  {id: 4, label: '3.0 - 4.0', min: 3, max: 4},
  {id: 5, label: '> 4.0', min: 4, max: 5}
];

const cooperationRanges = [
  {id: 1, label: '< 1.0', min: 0, max: 1},
  {id: 2, label: '1.0 - 2.0', min: 1, max: 2},
  {id: 3, label: '2.0 - 3.0', min: 2, max: 3},
  {id: 4, label: '3.0 - 4.0', min: 3, max: 4},
  {id: 5, label: '> 4.0', min: 4, max: 5}
];

const effortRanges = [
  {id: 1, label: '< 1.0', min: 0, max: 1},
  {id: 2, label: '1.0 - 2.0', min: 1, max: 2},
  {id: 3, label: '2.0 - 3.0', min: 2, max: 3},
  {id: 4, label: '3.0 - 4.0', min: 3, max: 4},
  {id: 5, label: '> 4.0', min: 4, max: 5}
];

function HomeView() {
  const [projs, setProjs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [removeTags, setRemoveTagss] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedComplexity, setSelectedComplexity] = useState([]);
  const [selectedCooperation, setSelectedCooperation] = useState([]);
  const [selectedEffort, setSelectedEffort] = useState([]);

  const toggleDropdown = () => {
    setOpenFilter(!openFilter);
  };

  // const handleTagCheckBox = (tag) => {
  //   const {value, checked} = e.target;
  //   if (checked) {
  //     setSelectedTags([...selectedTags, value]);
  //   } else {
  //     setSelectedTags(selectedTags.filter((tag) => tag !== value));
  //   }
  // };

  const handleComplexityCheckbox = (rangeID) => {    
    setSelectedComplexity((prev) => 
      prev.includes(rangeID)
      ? prev.filter((id) => id !== rangeID)
      : [...prev,rangeID]);
  };

  const handleCooperationCheckbox = (rangeID) => {    
    setSelectedCooperation((prev) => 
      prev.includes(rangeID)
      ? prev.filter((id) => id !== rangeID)
      : [...prev,rangeID]);
  };

  const handleEffortCheckbox = (rangeID) => {    
    setSelectedEffort((prev) => 
      prev.includes(rangeID)
      ? prev.filter((id) => id !== rangeID)
      : [...prev,rangeID]);
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
                  value={tag}
                  className="ml-10"
                />{tag}</li>)}
            </ul>
            {/* <ul>
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
            </ul> */}
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Complexity Ranges
              {complexityRanges.map((range) => (<li>
                <input 
                type="checkbox"
                id={range.id}
                value={range.label}
                onChange={() => handleComplexityCheckbox(range.id)}
                checked={selectedComplexity.includes(range.id)}
                className="ml-10" />{range.label}</li>))}            </ul>
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Cooperation Ranges
              {cooperationRanges.map((range) => (<li>
                <input 
                type="checkbox"
                id={range.id}
                value={range.label}
                onChange={() => handleCooperationCheckbox(range.id)}
                checked={selectedCooperation.includes(range.id)}
                className="ml-10" />{range.label}</li>))}            </ul>
            <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
              Effort Ranges
              {effortRanges.map((range) => (<li>
                <input 
                type="checkbox"
                id={range.id}
                value={range.label}
                onChange={() => handleEffortCheckbox(range.id)}
                checked={selectedEffort.includes(range.id)}
                className="ml-10" />{range.label}</li>))}
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
          // Filtering Complexity Ratings
          .filter((proj) => 
          selectedComplexity.length === 0 ||
          complexityRanges.filter((range) => selectedComplexity.includes(range.id))
          .some((range)=>proj.avg_complexity >= range.min && proj.avg_complexity <= range.max))
          // Filtering Cooperation Ratings
          .filter((proj) => 
          selectedCooperation.length === 0 ||
          cooperationRanges.filter((range) => selectedCooperation.includes(range.id))
          .some((range)=>proj.avg_cooperation >= range.min && proj.avg_cooperation <= range.max))
          // Filtering Effort Ratings
          .filter((proj) => 
          selectedEffort.length === 0 ||
          effortRanges.filter((range) => selectedEffort.includes(range.id))
          .some((range)=>proj.avg_effort >= range.min && proj.avg_effort <= range.max))
          // TO DO: Filter based on checkboxes
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
