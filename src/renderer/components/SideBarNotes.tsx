import React from 'react'
import SideBarNotesList from './SideBarNotesList';

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

const SideBarNotes: React.FC<Props> = ({notes, setNotes, title, setTitle, content, setContent}) =>{
  return (
    <SideBarNotesList notes={notes} setNotes={setNotes}  title={title} setTitle={setTitle} content={content} setContent={setContent}/>
  )
}

export default SideBarNotes;