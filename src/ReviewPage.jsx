import { useEffect, useState } from 'react';
import supabase from '@/supabase-client';
import { Link, useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard.jsx';
import { apiFetch } from '@/utils/apiFetch';

function ReviewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const projectData = await apiFetch(`/projects/${id}`);
        setProject(projectData);
      } catch (error) {
        console.error('Failed to fetch project details:', error);
      }

      // See if the user is already logged in (anonymously or otherwise)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      try {
        const endpoint = `/reviews/?project_id=${id}`;

        // If user has a session, attach the secure JWT token to the headers
        let fetchOptions = {};
        if (session && session.access_token) {
          fetchOptions = {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          };
        }

        const reviewsData = await apiFetch(endpoint, fetchOptions);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div className="p-4">
      <Link to="/">Return to Home</Link>
      <br />
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        {project?.title || 'Loading...'} Project Reviews
      </h2>
      {loading ? (
        <p className="text-gray-500 text-2xl text-center italic animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-red-500 text-2xl text-center">
          <strong>Sorry, there are no reviews for this project.</strong>
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review_id={review.id}
              upvote_count={review.upvote_count}
              downvote_count={review.downvote_count}
              user_vote={review.user_vote}
              complexity_rating={review.complexity_rating}
              cooperation_rating={review.cooperation_rating}
              effort_rating={review.effort_rating}
              academic_term={review.academic_term}
              academic_year={review.academic_year}
              review_text={review.review_text}
              created_at_year={review.created_at ? String(new Date(review.created_at).getFullYear()) : ''}
              created_at_day={review.created_at ? String(new Date(review.created_at).getDate()).padStart(2, '0') : ''}
              created_at_month={
                review.created_at ? String(new Date(review.created_at).getMonth() + 1).padStart(2, '0') : ''
              }
              pseudonym={review.pseudonym}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
