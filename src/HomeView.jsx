// References to help setup Supabase and React integration:
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM
// Reference to help with filtering capability
// https://www.tutorialspoint.com/how-to-use-checkboxes-in-reactjs#:~:text=In%20the%20handleChange()%20function%2C%20we%20check%20if%20the%20checkbox,target.
// https://coreui.io/answers/how-to-filter-a-list-in-react/#:~:text=Implementing%20filtering%20functionality%20allows%20users,searchTerm.
// https://www.youtube.com/watch?v=jN_s2uKntmc
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#:~:text=The%20filter()%20method%20is,included%20in%20the%20new%20array.
// https://www.geeksforgeeks.org/javascript/how-to-filter-an-array-from-all-elements-of-another-array-in-javascript/

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';
import Card from './Card.jsx';
import { Link } from 'react-router-dom'; // Use Link instead of <a> for speed!
import { Search, PenLine, SlidersHorizontal, X } from 'lucide-react';
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
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openFilter && filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFilter]);

  // Opens and closes more filter menu
  const toggleDropdown = () => {
    setOpenFilter(!openFilter);
  };

  // Clears all filter
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
        const techTagList = projData.flatMap(row => row.tech_tags);
        /* Reference for creating a unique list and sorting a list without case sensitivity
          https://dmitripavlutin.com/javascript-merge-arrays/#:~:text=%2C%20'Superman'%5D;-,const%20villains%20=%20%5B'Joker'%2C%20'Bane'%5D;,//%20merge%20array2%20into%20array1
          https://coreui.io/blog/how-to-sort-an-array-of-objects-by-string-property-value-in-javascript/#:~:text=appear%20after%20b%20.-,Case%2DInsensitive%20Sorting,name))*/
        const uniqueArray = [...new Set(techTagList)].sort((a, b) => {
          return a.localeCompare(b, undefined, { sensitivity: 'base' })
        });
        setTags(uniqueArray || []);
      } catch (error) {
        console.error('Error fetching project data from backend:', error);
      }
    }
    getProjects()
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      {/* Reference for search filter:
          https://www.youtube.com/watch?v=xAqCEBFGdYk */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 px-4">
        {/* Left side: Search + filter buttons */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              type="text"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="Search by project name or keyword..."
            />
          </div>
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors text-sm ${openFilter ? 'bg-primary text-primary-fg' : 'bg-card text-foreground border border-border hover:bg-muted'}`}
            onClick={toggleDropdown}>
            <SlidersHorizontal size={16} />
            More Filters
          </button>
          {(selectedTags.length > 0 || filterKeyword || minComplexity || maxComplexity || minCooperation || maxCooperation || minEffort || maxEffort) && (
            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors text-sm text-muted-fg hover:text-foreground hover:bg-muted border border-border bg-card"
              onClick={clearFilter}>
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
        {/* Right side: Submit a Review */}
        <Link
          to="/form"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-fg px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap w-full sm:w-auto"
        >
          <PenLine size={16} />
          Submit a Review
        </Link>
      </div>

      {/* Filter dropdown overlay */}
      <div className="relative px-4 mb-4" ref={filterRef}>
        {openFilter && (
          <div className="absolute left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-xl p-6 w-fit max-w-[calc(100vw-2rem)]">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Tech Stack */}
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-0">Keywords</h3>
                <span className="text-xs text-muted-fg mb-2 block">(select all that apply)</span>
                <div className="border border-border rounded-lg max-h-52 overflow-y-auto p-2 bg-muted/30 w-56">
                  {tags.map((tag) =>
                    <label key={tag} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        value={tag}
                        className="rounded border-border accent-primary"
                        onChange={() => handleTagCheckbox(tag)}
                        checked={selectedTags.includes(tag)}
                      />
                      <span className="text-sm text-foreground">{tag}</span>
                    </label>
                  )}
                </div>
              </div>
              {/* Rating Filters */}
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-1">Rating Ranges</h3>
                <RangeFilter
                  title="Complexity"
                  minVal={minComplexity}
                  maxVal={maxComplexity}
                  setMin={setMinComplexity}
                  setMax={setMaxComplexity}
                />
                <RangeFilter
                  title="Cooperation"
                  minVal={minCooperation}
                  maxVal={maxCooperation}
                  setMin={setMinCooperation}
                  setMax={setMaxCooperation}
                />
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
            (proj.tech_tags ?? []).some(tag => selectedTags.includes(tag)))
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
