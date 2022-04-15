import React, { useContext } from 'react'
import SideBarNote from './SideBarNote'
import { v4 as uuidv4 } from 'uuid';
import { SearchContext } from 'renderer/context/SearchContext';

interface INotes{
  title:string;
  content:string;
  dateModified:string;
}

interface Props{
  setNotes(notes: INotes[]):void;
  notes: INotes[];
  content:{
    value:string
  };
  title:string;
  setTitle(title:string):void;
  setContent(content:object):void;
}

const SideBarNotesList: React.FC<Props> = ({notes, setNotes, content, title, setTitle, setContent}) =>{
  const {search,setSearch}:any = useContext(SearchContext);

  let myFilter = (search=='') ? notes : notes.filter(obj => {
    if(obj.title.toLowerCase().replace(/ /g,'').includes(search.toLowerCase().replace(/ /g,'')))
      return obj.title;
  });

  return (
    <div id='noteList'>
      {myFilter.map((note) => {
        return <SideBarNote key={uuidv4()} notes={note} setNotes={setNotes} content={content} title={title} setTitle={setTitle} setContent={setContent} fullNotes={notes}/>
      })}
    </div>
  )
}

export default SideBarNotesList;