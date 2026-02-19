import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import { Link, useParams } from "react-router-dom"; // Use Link instead of <a> for speed!
import ReviewCard from "./ReviewCard.jsx";
import React from 'react';

function ReviewPage() {

  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProjects();
    getReviews();
  }, []);

  async function getProjects() {
    const { data, error } = await supabase.from("projects").select().eq("id", id).single();
    if (error) {
      console.log("Error: ", error);
    } else {
      setProjects(data || []);
    }
  }

  async function getReviews() {
    const { data, error } = await supabase.from("reviews").select().eq("project_id", id);
    if (error) {
      console.log("Error: ", error);
    } else {
      setReviews(data || []);
    }
  };

  return (
    <div className="p-4">
      <Link to="/">Return to Home</Link>
      <br />
      <h2 className="text-4xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
        {projects.title} Project Reviews
      </h2>
      {reviews.length === 0 ? 
        <p className="text-red-500 text-2xl text-center"><strong>Sorry, there are no reviews for this project.</strong></p> : (
      <div className="grid grid-[repeat(auto-fill,_minmax(500px,_2fr))] gap-2">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            complexity_rating={review.complexity_rating}
            cooperation_rating={review.cooperation_rating}
            effort_rating={review.effort_rating}
            academic_term={review.academic_term}
            academic_year={review.academic_year}
            review_text={review.review_text}
            created_at_year={review.created_at.slice(0, 4)}
            created_at_day={review.created_at.slice(8, 10)}
            created_at_month={review.created_at.slice(5, 7)}
            //Will implement using the backend API.
            pseudonym="TBD"
          />
        ))}
      </div>)}
    </div >
  );
}

export default ReviewPage;
