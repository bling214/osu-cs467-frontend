import { useEffect, useState } from 'react';
import supabase from '@/supabase-client';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PenLine } from 'lucide-react';
import ReviewCard from './ReviewCard.jsx';
import { apiFetch } from '@/utils/apiFetch';

function ReviewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // CLEAR STALE DATA: Prevents UI flashing when navigating between projects
      setProject(null);
      setReviews([]);
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
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors mb-4"
      >
        <ArrowLeft size={18} />
        Return to Home
      </Link>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4 font-heading">
        {project?.title || 'Loading...'} Project Reviews
      </h2>
      {/* Allows users to submit a review and prepopulates the selected project input */}
      {project && (
        <Link
          to={`/form?project=${id}`}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium mt-4 mb-8"
        >
          <PenLine size={16} />
          Submit a Review
        </Link>
      )}
      {loading ? (
        <p className="text-muted-fg text-2xl text-center italic animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-red-500 text-2xl text-center mt-16">
          <strong>Sorry, there are no reviews for this project.</strong>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review_id={review.id}
              upvote_count={review.upvote_count}
              downvote_count={review.downvote_count}
              comment_count={review.comment_count}
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
