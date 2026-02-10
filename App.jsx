// References to help setup Supabase and React integration: 
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import './App.css';
import Card from './Card.jsx';
import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import React from "react";

function App() {
  const [projs, setProjs] = useState([]);

  useEffect(() => {
    getProjs();
  }, []);

  async function getProjs(){
    const {data, error} = await supabase.from("projects").select();
    if (error) {
      console.log("Error: ", error);
    } else {
    setProjs(data);
    }
  };
  return (

    // Reference for grid format:
    //https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
       {projs.map((proj)=> (
        <Card 
        key={proj.id}
        image_link = {proj.img_url}
        project_title={proj.title} 
        complexity_rating="TBD"
        cooperation_rating="TBD"
        effort_rating="TBD"
        tech_tags={proj.tech_tags.join(', ')}
        project_link={proj.portal_url}
        number_of_ratings="TBD"
        ratings_link="#"></Card>
       ))}
    </div>
  );
}

export default App;
