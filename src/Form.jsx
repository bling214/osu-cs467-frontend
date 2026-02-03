import "./Form.css";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import supabase from "./supabase-client";

function Form() {
    const minHours=1;
    const currentYear = new Date().getFullYear();
    const [projs, setProjs] = useState([]);
    const [selectProj, setSelectProj] = useState('');
    const [selectTerm, setSelectTerm] = useState('');
    const [selectTermYear, setSelectTermYear] = useState(currentYear);
    const [selectComp, setSelectComp] = useState('');
    const [selectHours, setSelectHours] = useState('');
    const [selectComment, setSelectComment] = useState('Write Here...');

    const yearList = [];
    for (let i=currentYear-15; i<=currentYear; i++){
        yearList.push(i);
    }

    const handleProjChange = (e) => {
        setSelectProj(e.target.value)
    }

    const handleTerm = (e) => {
        setSelectTerm(e.target.value)
    }

    const handleTermYear = (e) => {
        setSelectTermYear(e.target.value)
    }

    const handleCompChange = (e) => {
        setSelectComp(e.target.value)
    }

    const handleHours = (e) => {
        setSelectHours(e.target.value)
    }

    const handleComment = (e) => {
        setSelectComment(e.target.value)
    }

    useEffect(() => {
        getProjs();
    }, []);

    async function getProjs() {
        const {data, error} = await supabase.from("projects").select();
        if (error) {
            console.log("Error: ", error);
        } else {
            setProjs(data);
        }
    }
  return (
    <div>
        <a href="/">Return to Home</a>
        <br />
        <br />
        <form>
            <label> Select Project:
                <select value={selectProj} onChange={handleProjChange}>
                    {projs.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.title}</option>
                    ))}     
                </select>
            </label>
            <br />
            <br />
            <label> Select Term and Year:
                <select value={selectTerm} onChange={handleTerm}>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                </select>
                <select value={selectTermYear} onChange={handleTermYear}>
                        {yearList.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                </select>

            </label>
            <br />
            <br />
            <label>Complexity: 
                <select value={selectComp} onChange={handleCompChange} type="number">
                    <option value="1" name="difficulty">1 - Very Easy</option>
                    <option value="2" name="difficulty">2 - Easy</option>
                    <option value="3" name="difficulty">3 - Moderate</option>
                    <option value="4" name="difficulty">4 - Difficult</option>
                    <option value="5" name="difficulty">5 - Extremely Difficult</option>
                </select>
            </label>
            <br />
            <br />
            <label>Effort (Hours/Week): 
                <input value={selectHours} onChange={handleHours} type="number" min={minHours} />
            </label>

            <br />
            <br />
            <label>Review: 
                <input value={selectComment} onChange={handleComment} />
            </label>
            
        </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('form')).render(<Form />);
