import { useEffect, useRef, useState } from 'react';
import supabase from '@/supabase-client';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, PenLine } from 'lucide-react';
import ReviewCard from './ReviewCard.jsx';
import { apiFetch } from '@/utils/apiFetch';

const formatRating = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return Number.isInteger(value) ? `${value}/5` : `${value.toFixed(2)}/5`;
};

const RatingBox = ({ label, value }) => (
  <div className="flex-1 text-center border border-border rounded px-3 py-1.5">
    <div className="text-[10px] uppercase tracking-wide text-muted-fg font-semibold">{label}</div>
    <div className="font-bold text-sm">{formatRating(value)}</div>
  </div>
);

function ReviewPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descClamped, setDescClamped] = useState(false);
  const descRef = useRef(null);

  // Reset description expansion/clamp state when switching projects
  useEffect(() => {
    if (project?.id) {
      setDescExpanded(false);
      setDescClamped(false);
    }
  }, [project?.id]);

  // Measure whether the description is clamped while it is in its clamped state
  useEffect(() => {
    if (descRef.current && !descExpanded) {
      setDescClamped(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    }
  }, [project, descExpanded]);

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
        {project?.title || 'Loading...'}
      </h2>
      {project && (
        <div className="space-y-4 mb-8">
          {project.description && (
            <div>
              <p
                ref={descRef}
                className={`text-muted-fg ${!descExpanded ? 'line-clamp-4' : ''}`}
              >
                {project.description}
              </p>
              {descClamped && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-primary hover:text-primary/80 text-sm font-medium mt-1"
                >
                  {descExpanded ? 'Show less' : '...Show more'}
                </button>
              )}
            </div>
          )}
          {project.tech_tags && project.tech_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tech_tags.map((tag) => (
                <span key={tag} className="text-xs font-medium bg-tag-bg text-tag-fg px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2 max-w-md">
            <RatingBox label="Complexity" value={project.avg_complexity ?? 'N/A'} />
            <RatingBox label="Cooperation" value={project.avg_cooperation ?? 'N/A'} />
            <RatingBox label="Effort" value={project.avg_effort ?? 'N/A'} />
          </div>
          <div className="flex flex-wrap gap-3">
            {project.portal_url && (
              <a
                href={project.portal_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2 rounded-lg hover:bg-primary/5 transition-colors font-medium"
              >
                <ExternalLink size={16} />
                OSU Project Portal
              </a>
            )}
            {/* Allows users to submit a review and prepopulates the selected project input */}
            <Link
              to={`/form?project=${id}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <PenLine size={16} />
              Submit a Review
            </Link>
          </div>
        </div>
      )}
      {loading ? (
        <p className="text-muted-fg text-2xl text-center italic animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-red-500 text-2xl text-center">
          <strong>Sorry, there are no reviews for this project.</strong>
        </p>
      ) : (
        <>
        <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
          Reviews ({reviews.length})
        </h3>
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
        </>
      )}
    </div>
  );
}

export default ReviewPage;
