import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import './Search.css'
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [keyword, setkeyword] = useState("")
  const navigate=useNavigate()

  const handleSearch=(e)=>{
    e.preventDefault();
    if(keyword.trim()){
      navigate(`/courses/${keyword}`)
      setkeyword("")
    }else{
      navigate(`/courses`)

    }
  }
  return (
   <div className="search">
    <input value={keyword} onChange={(e)=>setkeyword(e.target.value)} type="text" placeholder='Search the courses....' />

<SearchIcon onClick={handleSearch}   className='search-icon'/>

   </div>
  )
}

export default Search