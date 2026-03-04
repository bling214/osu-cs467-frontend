import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { debugLog } from '@/utils/logger';
import { apiFetch } from '@/utils/apiFetch';
import { getAuthenticatedHeaders } from '@/utils/auth';

const complexityLevels = {
  1: '1 - Very Easy',
  2: '2 - Easy',
  3: '3 - Moderate',
  4: '4 - Difficult',
  5: '5 - Extremely Difficult',
};

const cooperationLevels = {
  1: '1 - Poor',
  2: '2 - Bad',
  3: '3 - Average',
  4: '4 - Good',
  5: '5 - Excellent',
};

const effortLevels = {
  1: '1 - Very Low',
  2: '2 - Low',
  3: '3 - Moderate',
  4: '4 - High',
  5: '5 - Very High',
};

function Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentYear = new Date().getFullYear();
  const [projs, setProjs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Individual states to handle form inputs
  const [selectProj, setSelectProj] = useState(searchParams.get('project') || '');
  const [selectTerm, setSelectTerm] = useState('Winter');
  const [selectTermYear, setSelectTermYear] = useState(currentYear);
  const [selectComp, setSelectComp] = useState('3');
  const [selectEffort, setSelectEffort] = useState('3');
  const [selectCoop, setSelectCoop] = useState('3');
  const [selectComment, setSelectComment] = useState('');

  // If navigated from a review page, determine the project name for the back link
  const projectParam = searchParams.get('project');
  const selectedProject = projs.find((p) => String(p.id) === String(projectParam));

  const yearList = [];
  for (let i = 2000; i <= currentYear; i++) {
    yearList.push(i);
  }

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await apiFetch('/projects/');
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setProjs(sortedData);
      } catch (error) {
        console.error('Error fetching projects: ', error);
      }
    };

    getProjects();
  }, []);

  async function addReview(e) {
    e.preventDefault();
    setLoading(true);

    // 1. Client-Side Validation (Fail Fast)
    const invalidFields = [];
    if (!selectProj) invalidFields.push('Project');
    if (!selectTerm) invalidFields.push('Academic Term');

    if (!selectTermYear || Number.isNaN(parseInt(selectTermYear, 10))) invalidFields.push('Academic Year');
    if (!selectComp || Number.isNaN(parseInt(selectComp, 10))) invalidFields.push('Complexity');
    if (!selectEffort || Number.isNaN(parseInt(selectEffort, 10))) invalidFields.push('Effort');
    if (!selectCoop || Number.isNaN(parseInt(selectCoop, 10))) invalidFields.push('Cooperation');

    const trimmedComment = (selectComment || '').trim();
    if (trimmedComment.length < 10) invalidFields.push('Review Text (minimum 10 characters)');

    if (invalidFields.length > 0) {
      alert('Please provide valid values for: ' + invalidFields.join(', ') + '.');
      setLoading(false);
      return;
    }

    try {
      // Lazy Authentication & Profile Init via Utility with Contextual Error Handling
      const headers = await getAuthenticatedHeaders('review');

      // Construct Payload safely
      const payload = {
        project_id: selectProj,
        complexity_rating: parseInt(selectComp, 10),
        effort_rating: parseInt(selectEffort, 10),
        cooperation_rating: parseInt(selectCoop, 10),
        review_text: trimmedComment,
        academic_term: selectTerm,
        academic_year: parseInt(selectTermYear, 10),
      };

      debugLog(`Submitting review for project ID: ${payload.project_id}`);

      // Send to FastAPI Backend
      await apiFetch('/reviews/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      debugLog('Review submission API call succeeded.');
      alert('Review submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        to={selectedProject ? `/review/${projectParam}` : '/'}
        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors mb-4"
      >
        <ArrowLeft size={18} />
        {selectedProject ? `Cancel / Return to Project Reviews` : 'Return to Home'}
      </Link>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 border-l-4 border-primary pl-4 font-heading">
        Submit a Project Review
      </h2>
      <form onSubmit={addReview}>
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Select Project: </td>
              <td>
                <select
                  value={selectProj}
                  onChange={(e) => setSelectProj(e.target.value)}
                  required
                  className="max-w-xs w-full"
                >
                  <option value="">-- Choose a Project --</option>
                  {projs.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td> Academic Term: </td>
              <td>
                <select value={selectTerm} onChange={(e) => setSelectTerm(e.target.value)}>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                </select>
              </td>
            </tr>
            <tr>
              <td> Academic Year: </td>
              <td>
                <select value={selectTermYear} onChange={(e) => setSelectTermYear(e.target.value)}>
                  {yearList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Complexity Rating: </td>
              <td>
                <select value={selectComp} onChange={(e) => setSelectComp(e.target.value)}>
                  {Object.keys(complexityLevels).map((num) => (
                    <option key={num} value={num}>
                      {complexityLevels[num]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Cooperation Rating: </td>
              <td>
                <select value={selectCoop} onChange={(e) => setSelectCoop(e.target.value)}>
                  {Object.keys(cooperationLevels).map((num) => (
                    <option key={num} value={num}>
                      {cooperationLevels[num]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Effort Rating: </td>
              <td>
                <select value={selectEffort} onChange={(e) => setSelectEffort(e.target.value)}>
                  {Object.keys(effortLevels).map((num) => (
                    <option key={num} value={num}>
                      {effortLevels[num]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Review: </td>
              <td>
                <textarea
                  className="border border-border bg-card text-foreground rounded p-2 w-full"
                  value={selectComment}
                  onChange={(e) => setSelectComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                />
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        <br />
        <button type="submit" disabled={loading} className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default Form;
