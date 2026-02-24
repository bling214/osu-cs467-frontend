import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '@/supabase-client';
import { debugLog } from '@/utils/logger';
import { apiFetch } from '@/utils/apiFetch';

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

  const currentYear = new Date().getFullYear();
  const [projs, setProjs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Individual states to handle form inputs
  const [selectProj, setSelectProj] = useState('');
  const [selectTerm, setSelectTerm] = useState('Winter');
  const [selectTermYear, setSelectTermYear] = useState(currentYear);
  const [selectComp, setSelectComp] = useState('3');
  const [selectEffort, setSelectEffort] = useState('3');
  const [selectCoop, setSelectCoop] = useState('3');
  const [selectComment, setSelectComment] = useState('');

  const yearList = [];
  for (let i = 2000; i <= currentYear; i++) {
    yearList.push(i);
  }

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('title', { ascending: true });

      if (error) {
        console.error('Error fetching projects: ', error);
      } else {
        setProjs(data);
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
      // 2. Get Supabase Session/JWT
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      let jwt;
      if (authError || !session) {
        debugLog('No active session, attempting anonymous sign-in...');
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) throw anonError;
        jwt = anonData.session.access_token;
      } else {
        jwt = session.access_token;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      };

      // 3. Initialize Profile (Strict Error Handling)
      try {
        await apiFetch('/profiles/init', {
          method: 'POST',
          headers: headers,
        });
      } catch (initError) {
        console.error('Profile init error:', initError);
        throw new Error(
          "We couldn't set up your profile, so your review can't be submitted right now. Please try again.",
        );
      }

      // 4. Construct Payload safely
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

      // 5. Send to FastAPI Backend
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
      <Link to="/">Return to Home</Link>
      <br />
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">Submit a Project Review</h2>
      <form onSubmit={addReview}>
        <table>
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
                <select value={selectProj} onChange={(e) => setSelectProj(e.target.value)} required>
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
                  className="border p-1 w-full"
                  value={selectComment}
                  onChange={(e) => setSelectComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default Form;
