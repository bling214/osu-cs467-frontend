// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM
// Reference to help with filtering capability
// https://www.tutorialspoint.com/how-to-use-checkboxes-in-reactjs#:~:text=In%20the%20handleChange()%20function%2C%20we%20check%20if%20the%20checkbox,target.
// https://coreui.io/answers/how-to-filter-a-list-in-react/#:~:text=Implementing%20filtering%20functionality%20allows%20users,searchTerm.
// https://www.youtube.com/watch?v=jN_s2uKntmc
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#:~:text=The%20filter()%20method%20is,included%20in%20the%20new%20array.
// https://www.geeksforgeeks.org/javascript/how-to-filter-an-array-from-all-elements-of-another-array-in-javascript/

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!
import { Search, PenLine, SlidersHorizontal, X, Dice1 } from 'lucide-react';
import supabase from '@/supabase-client';
import RangeFilter from './MinMaxRating.jsx';

function HomeView() {
  const [projs, setProjs] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [tags, setTags] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [minComplexity, setMinComplexity] = useState('');
  const [maxComplexity, setMaxComplexity] = useState('');
  const [minCooperation, setMinCooperation] = useState('');
  const [maxCooperation, setMaxCooperation] = useState('');
  const [minEffort, setMinEffort] = useState('');
  const [maxEffort, setMaxEffort] = useState('');

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i
  );

  // Opens and closes more filter menu
  const toggleDropdown = () => {
    setOpenFilter(!openFilter);
  };

  // Clears all filter
  // TO DO: Add Academic Year and Term
  const clearFilter = () => {
    setOpenFilter(false);
    setSelectedTags([]);
    setFilterKeyword('');
    setMinComplexity('');
    setMaxComplexity('');
    setMinCooperation('');
    setMaxCooperation('');
    setMinEffort('');
    setMaxEffort('');
  }

  // Event handler for Tech Tags
  const handleTagCheckbox = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]);
  };

  useEffect(() => {
    // Fetching 'projects' and 'reviews' data from backend API.
    async function getProjects() {
      try {
        const projData = await apiFetch('/projects/');
        setProjs(projData || []);
      } catch (error) {
        console.error('Error fetching project data from backend:', error);
      }
    }

    // Gathering a list of all possible and selectable tech tags based on the project information.
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
    getProjects()
    getTags();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      {/* Reference for search filter:
          https://www.youtube.com/watch?v=xAqCEBFGdYk */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4 max-w-2xl mx-auto px-4">
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
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-fg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap w-full sm:w-auto"
        >
          <PenLine size={16} />
          Submit a Review
        </Link>
      </div>
      <div>
        <div className="flex gap-2 items-center justify-center mb-2">
          <button
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-fg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap w-full sm:w-auto"
            onClick={toggleDropdown}>
            <SlidersHorizontal size={20} />
            More Filters
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-fg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap w-full sm:w-auto"
            onClick={clearFilter}>
            <X size={20} />
            Clear Filters
          </button>
        </div>
        {openFilter && (
          <div className="flex gap-4 bg-secondary relative absolute z-50 items-center justify-center w-fit rounded-md shadow-lg focus:outline-none border border-gray-600 bg-gray-400">
            <ul>
              <h3 className="text-lg text-gray-900 m-2 ml-6"><strong>Tech Stack</strong></h3>
              <div className="border border-border rounded-lg max-h-48 max-w-72 overlfow-y-auto overflow-scroll p-2 ml-6 bg-card">
                {tags.map((tag) =>
                  <label key={tag} className="flex item-center gap-2 p-1 hover:bg-muted rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={tag}
                      className="rounded border-gray-400"
                      onChange={() => handleTagCheckbox(tag)}
                      checked={selectedTags.includes(tag)}
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                )}
              </div>
            </ul>
            <div>
              <div className="m-6">
                <RangeFilter
                  title="Complexity"
                  minVal={minComplexity}
                  maxVal={maxComplexity}
                  setMin={setMinComplexity}
                  setMax={setMaxComplexity}
                />
              </div>
              <div className="m-6">
                <RangeFilter
                  title="Cooperation"
                  minVal={minCooperation}
                  maxVal={maxCooperation}
                  setMin={setMinCooperation}
                  setMax={setMaxCooperation}
                />
              </div>
              <div className="m-6">
                <RangeFilter
                  title="Effort"
                  minVal={minEffort}
                  maxVal={maxEffort}
                  setMin={setMinEffort}
                  setMax={setMaxEffort}
                />
              </div>
            </div>
          </div>
        )}

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
          // Filtering Tech Tags
          .filter((proj) =>
            selectedTags.length === 0 ||
            proj.tech_tags.some(tag => selectedTags.includes(tag)))
          // Filtering Complexity Ratings
          .filter((proj) => {
            // If both are empty, let everything pass
            if (minComplexity === '' && maxComplexity === '') return true;

            // Treat empty min as 0, empty max as 5
            const min = minComplexity === '' ? 0 : parseFloat(minComplexity);
            const max = maxComplexity === '' ? 5 : parseFloat(maxComplexity);

            return proj.avg_complexity >= min && proj.avg_complexity <= max;
          })
          // // Filtering Cooperation Ratings
          .filter((proj) => {
            // If both are empty, let everything pass
            if (minCooperation === '' && maxCooperation === '') return true;

            // Treat empty min as 0, empty max as 5
            const min = minCooperation === '' ? 0 : parseFloat(minCooperation);
            const max = maxCooperation === '' ? 5 : parseFloat(maxCooperation);

            return proj.avg_cooperation >= min && proj.avg_cooperation <= max;
          })
          // Filtering Effort Ratings
          .filter((proj) => {
            // If both are empty, let everything pass
            if (minEffort === '' && maxEffort === '') return true;

            // Treat empty min as 0, empty max as 5
            const min = minEffort === '' ? 0 : parseFloat(minEffort);
            const max = maxEffort === '' ? 5 : parseFloat(maxEffort);

            return proj.avg_effort >= min && proj.avg_effort <= max;
          })
          // Displays remaining project cards.
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
