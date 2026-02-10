import "./Form.css";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import React from "react";

function Form() {
    const minHours=1;
    const currentYear = new Date().getFullYear();
    const [projs, setProjs] = useState([]);
    const [selectProj, setSelectProj] = useState('');
    const [selectTerm, setSelectTerm] = useState('');
    const [selectTermYear, setSelectTermYear] = useState(currentYear);
    const [selectComp, setSelectComp] = useState('');
    const [selectEffort, setSelectEffort] = useState('');
    const [selectCoop, setSelectCoop] = useState('');
    const [selectComment, setSelectComment] = useState('');
    const [newReview, setNewReview] = useState({
        project_id: '',
        user_id: '',
        academic_year: '',
        academic_term: '',
        complexity_rating: '',
        effort_rating: '',
        cooperation_rating: '',
        review_text: ''
    });

    const yearList = [];
    for (let i=2000; i<=currentYear; i++){
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

    const handleEffortChange = (e) => {
        setSelectEffort(e.target.value)
    }

    const handleCoopChange = (e) => {
        setSelectCoop(e.target.value)
    }

    const handleComment = (e) => {
        setSelectComment(e.target.value)
    }

    const fetchReviews = async () => {
        const{data} = await supabase.from("reviews").select("*");
        if (data) {
            setNewReview(data);
        }
    }

    useEffect(() => {
        getProjs();
        fetchReviews();
    }, []);

    async function getProjs() {
        const {data, error} = await supabase.from("projects").select("*").order("title", {"ascending": true});
        if (error) {
            console.log("Error: ", error);
        } else {
            setProjs(data);
        }
    }

    async function addReview (e){
        await supabase
        .from('reviews')
        .insert({
            project_id: newReview.project_id,
            academic_year: newReview.academic_year,
            academic_term: newReview.academic_term,
            complexity_rating: newReview.complexity_rating,
            cooperation_rating: newReview.cooperation_rating,
            effort_rating: newReview.effort_rating,
            review_text: newReview.review_text,
        })
        if (error) {
            console.log(error);
        } else {
            setNewReview((prev) => [data, ...prev]);
        }
    }

  return (
    <div>
        <a href="/">Return to Home</a>
        <br />
        <br />
        <form onSubmit={addReview}>
            <table>
                <thead>
                    <tr>
                        <th>Parameters</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> Select Project: </td>
                        <td>
                            <select type="text" name="project_id" value={selectProj} onChange={handleProjChange}>
                                {projs.map((proj) => (
                                <option key={proj.id} value={proj.id}>{proj.title}</option>
                                ))}     
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td> Select Academic Term: </td>
                        <td>
                            <select type="text" name='academic_term' value={selectTerm} onChange={handleTerm}>
                                <option value="Winter">Winter</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                                <option value="Fall">Fall</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td> Select Academic Year: </td>
                        <td>
                            <select text="number" name="academic_year" value={selectTermYear} onChange={handleTermYear}>
                                    {yearList.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                            </select>
                        </td>
                    </tr>
            <tr>
                <td>Complexity Rating: </td>
                <td>
                    <select type="number" name="complexity_rating" value={selectComp} onChange={handleCompChange}>
                        <option value="1">1 - Very Easy</option>
                        <option value="2">2 - Easy</option>
                        <option value="3">3 - Moderate</option>
                        <option value="4">4 - Difficult</option>
                        <option value="5">5 - Extremely Difficult</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Cooperation Rating: </td>
                <td>
                    <select type="number" name="cooperation_rating" value={selectCoop} onChange={handleCoopChange}>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Bad</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Effort Rating: </td>
                <td>
                    <select type="number" name="effort_rating" value={selectEffort} onChange={handleEffortChange}>
                        <option value="1">1 - Very Low</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Moderate</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Very High</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Review: </td>
                <td>
                    <input type="text" name="review_text" value={selectComment} onChange={handleComment} />
                </td>
            </tr>
        </tbody>
        </table>
        <br />
        <button type="submit">Submit</button>
    </form>
</div>
);
}

ReactDOM.createRoot(document.getElementById('form')).render(<Form />);
