import './App.css';
import Card from './Card.jsx';
import { useEffect, useState } from "react";
import supabase from "./supabase-client";

function App() {
  const [projs, setProjs] = useState([]);

  useEffect(() => {
    getProjs();
  }, []);

  async function getProjs(){
    const {data} = await supabase.from("projects").select();
    setProjs(data);
  };
  return (
    //https://dev.to/musselmanth/the-dynamic-css-grid-configuration-ive-been-looking-for-1ogd
    <div class="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
       {projs.map((proj)=> (
        <Card 
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

export default App;
