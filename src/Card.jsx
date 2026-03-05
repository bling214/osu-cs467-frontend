// References to help design React App with Tailwind CSS:
// https://v2.tailwindcss.com/docs
// https://www.youtube.com/watch?v=IJ85kCdqWao

import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';

const formatRating = (value) => {
  if (typeof value !== 'number') return value;
  return Number.isInteger(value) ? `${value}/5` : `${value.toFixed(2)}/5`;
};

const RatingBox = ({ label, value }) => (
  <div className="flex-1 text-center border border-border rounded px-3 py-1.5">
    <div className="text-[10px] uppercase tracking-wide text-muted-fg font-semibold">{label}</div>
    <div className="font-bold text-sm">{formatRating(value)}</div>
  </div>
);

const Card = (props) => {
  const {
    project_title,
    complexity_rating,
    cooperation_rating,
    effort_rating,
    tech_tags,
    project_link,
    number_of_ratings,
    ratings_link,
    image_link,
  } = props;

  const tags = typeof tech_tags === 'string' ? tech_tags.split(', ').filter(Boolean) : [];

  return (
    <div className="bg-card text-foreground rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <div className="h-40 bg-secondary relative">
        {image_link ? (
          <img src={image_link} alt={project_title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-fg">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 text-center">{project_title}</h3>

        {/* Tags + Ratings + Buttons pinned to bottom */}
        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap-reverse content-end justify-center gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs font-medium bg-tag-bg text-tag-fg px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <RatingBox label="Complexity" value={complexity_rating} />
            <RatingBox label="Cooperation" value={cooperation_rating} />
            <RatingBox label="Effort" value={effort_rating} />
          </div>
          <div className="space-y-2">
          <a
            href={project_link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-fg py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <ExternalLink size={14} />
            OSU Project Portal
          </a>
          <Link
            to={ratings_link}
            className="flex items-center justify-center gap-2 w-full border border-primary text-primary py-2 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
          >
            <Star size={14} />
            {number_of_ratings} Student Ratings
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
