import React from 'react';
import { IoSearchSharp } from "react-icons/io5";
const SearchBar = ({searchFunction}) => {
    return (
        <div className='searchBar'>
            <input type="text" className='searchInput' placeholder='Search By Title/YYYY-MM-DD/priority' onChange={(e)=>searchFunction(e.target.value)}/>
            <IoSearchSharp/>
        </div>
    );
};

export default SearchBar;