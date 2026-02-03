// References to help setup Supabase and React integration: 
// https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
// https://www.youtube.com/watch?v=tW1HO7i9EIM

import './App.css';
import Card from './Card.jsx';
import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import React from "react";
import Home from './Index.jsx';
import Form from './Form.jsx';

function Index() {
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
        imageLink = {proj.img_url}
        projTitle={proj.title} 
        complexity="TBD"
        effort="TBD"
        techTags={proj.tech_tags}
        projLink={proj.portal_url}
        numRatings="TBD"
        ratingsLink="#"></Card>
       ))}
    </div>
  );
}

export default Index;
