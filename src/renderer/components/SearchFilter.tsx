import React, { useContext } from 'react'
import { SearchContext } from 'renderer/context/SearchContext';

interface INotes{
  title:string;
  content:string;
  dateModified:string;
}

interface Props{
  notes: INotes[];
  setNotes(notes: INotes[]):void;
}


const SearchFilter: React.FC<Props>= ({notes,setNotes})=>{
  const {search, setSearch}:any = useContext(SearchContext);

  const OnSearchFilterChange = (e: { target: { value: any; }; })=>{
    console.log(notes);
    console.log(e.target.value);
    setSearch(e.target.value);
  }
  return (
    <div className="sideBarSearchFilter">
      <input type="search" id="searchFilter" spellCheck="false" placeholder="Seach/Filter" onChange={OnSearchFilterChange}/>
    </div>
  )
}

export default SearchFilter;