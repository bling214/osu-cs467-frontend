import { useEffect, useState } from "react";
import supabase from "@/supabase-client";
import { Link, useParams } from "react-router-dom"; // Use Link instead of <a> for speed!
import ReviewCard from "./ReviewCard.jsx";


function ReviewPage() {

  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Defining functions inside useEffect prevents stale closures
    async function fetchData() {
      const projectRes = await supabase.from("projects").select().eq("id", id).single();
      if (!projectRes.error) setProject(projectRes.data);

      const reviewRes = await supabase.from("reviews").select().eq("project_id", id);
      if (!reviewRes.error) setReviews(reviewRes.data);
    }

    fetchData();
  }, [id]); // Added 'id' as a dependency


  return (
    <div className="p-4">
      <Link to="/">Return to Home</Link>
      <br />
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        {project?.title || "Loading..."} Project Reviews
      </h2>
      {reviews.length === 0 ? 
        <p className="text-red-500 text-2xl text-center"><strong>Sorry, there are no reviews for this project.</strong></p> : (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-2">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            complexity_rating={review.complexity_rating}
            cooperation_rating={review.cooperation_rating}
            effort_rating={review.effort_rating}
            academic_term={review.academic_term}
            academic_year={review.academic_year}
            review_text={review.review_text}
            created_at_year={review.created_at ? String(new Date(review.created_at).getFullYear()) : ""}
            created_at_day={
              review.created_at
                ? String(new Date(review.created_at).getDate()).padStart(2, "0")
                : ""
            }
            created_at_month={
              review.created_at
                ? String(new Date(review.created_at).getMonth() + 1).padStart(2, "0")
                : ""
            }
            //Will implement using the backend API.
            pseudonym="TBD"
          />
        ))}
      </div>)}
    </div >
  );
}

export default ReviewPage;
