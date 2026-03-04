import React from "react";
import supabase from '@/supabase-client';
import { useEffect, useState } from 'react';
import { SlidersHorizontal } from "lucide-react";

const complexityRanges = {
    1: '< 1.0',
    2: '1.0 - 2.0',
    3: '2.0 - 3.0',
    4: '3.0 - 4.0',
    5: '> 4.0',
};

const cooperationRanges = {
    1: '< 1.0',
    2: '1.0 - 2.0',
    3: '2.0 - 3.0',
    4: '3.0 - 4.0',
    5: '> 4.0',
};

const effortRanges = {
    1: '< 1.0',
    2: '1.0 - 2.0',
    3: '2.0 - 3.0',
    4: '3.0 - 4.0',
    5: '> 4.0',
};

const MoreFilter = () => {

    const [tags, setTags] = useState([]);
    const [academicTerms, setAcademicTerms] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    
    const toggleDropdown = () => {
        setOpenFilter(!openFilter);
    };

    useEffect(() => {
        const getTags = async () => {
            const { data, error } = await supabase.from('projects').select("tech_tags");
            if (error) {
                console.log('Error: ', error);
            } else {
                const techTagList = data.flatMap(row => row.tech_tags);
                {/* Reference for creating a unique list and sorting a list without case sensitivity
                https://dmitripavlutin.com/javascript-merge-arrays/#:~:text=%2C%20'Superman'%5D;-,const%20villains%20=%20%5B'Joker'%2C%20'Bane'%5D;,//%20merge%20array2%20into%20array1
                https://coreui.io/blog/how-to-sort-an-array-of-objects-by-string-property-value-in-javascript/#:~:text=appear%20after%20b%20.-,Case%2DInsensitive%20Sorting,name))*/}
                const uniqueArray = [...new Set(techTagList)].sort((a, b) => {
                    return a.localeCompare(b, undefined, { sensitivity: 'base' })
                });
                setTags(uniqueArray || []);
            }
        }

        const getAcademicTerms = async () => {
            const { data, error } = await supabase.from('reviews').select('academic_year, academic_term');
            if (error) {
                console.log('Error: ', error);
            } else {
                const academicYearList = data.map(term =>
                    `${term.academic_year} ${term.academic_term}`);
                {/* Reference for creating a combined string array and sorting a list descending
                https://github.com/AnkitSharma-007/namaste-javascript-notes
                https://www.w3schools.com/jsref/jsref_sort.asp
                */}
                const uniqueTermArray = [...new Set(academicYearList)].sort(function (a, b) { return b - a });
                setAcademicTerms(uniqueTermArray || []);
            }
        }

        getTags();
        getAcademicTerms();
    }, []);

    return (
        <div>
            <button 
            className="icon-button flex justify-end items-center border border-gray-400 p-1 rounded-lg bg-gray-700 text-white"
            onClick={toggleDropdown}>
                <SlidersHorizontal className="icon" />
                <span className="p-2">
                    More Filters
                </span>
            </button>
            {openFilter && (
                <div className="flex absolute items-start mt-2 w-auto rounded-md shadow-lg focus:outline-none border border-gray-600 bg-gray-400 text-justify">
                    <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
                    Tech Stack
                    {tags.map((tag) => <li><input type="checkbox" className="ml-10" /> {tag}</li>)}
                    </ul>
                    <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
                    Academic Terms
                    {academicTerms.map((academicTerm) => <li><input type="checkbox" className="ml-10" /> {academicTerm}</li>)}
                    </ul>
                    <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
                    Complexity Ranges
                    {Object.keys(complexityRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {complexityRanges[num]}</li>))}
                    </ul>
                    <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
                    Cooperation Ranges
                    {Object.keys(cooperationRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {cooperationRanges[num]}</li>))}
                    </ul>
                    <ul><input type="checkbox" className="text-sm text-gray-700 m-2" />
                    Effort Ranges
                    {Object.keys(effortRanges).map((num) => (<li><input type="checkbox" key="num" value="num" className="ml-10" /> {effortRanges[num]}</li>))}
                    </ul>
                </div>
                
            )}
            
        </div>
    )
}

export default MoreFilter;
