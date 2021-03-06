import React, { useContext, useLayoutEffect, useState } from 'react';
import { ActiveNoteContext } from 'renderer/context/ActiveNoteContext';
import { FilePathContext } from 'renderer/context/FilePathContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TiDelete } from 'react-icons/ti';

interface INotes {
  title: string;
  content: string;
  dateModified: string;
}

interface Props {
  notes: INotes;
  setNotes(notes: INotes[]): void;
  content: {
    value: string;
  };
  title: string;
  setTitle(title: string): void;
  setContent(content: object): void;
  fullNotes: INotes[];
}


const SideBarNote: React.FC<Props> = ({notes, setNotes, content, title, setTitle, setContent, fullNotes}) =>{

  const {activeNote, setActiveNote}:any = useContext(ActiveNoteContext);
  const {filePath, setFilePath}:any = useContext(FilePathContext);

  useLayoutEffect (() =>{
    if(activeNote==notes.title){
      console.log('active note');
    }
  },[activeNote]);

  let displayInfo=(event:any)=>{
    if(event.target.className=='deleteButton'){
      console.log('delete' + event.target.className);
    }
    else if(event.target.className=='[object SVGAnimatedString]'){
      console.log('clicked icon');
    }
    else{
      console.log('clicked ' + event.target.type);
      console.log(notes.content);
      console.log(notes.title.substring(0, notes.title.length - 4));
      setContent({value: notes.content, caret: -1, target: null});
      setTitle(notes.title.substring(0, notes.title.length - 4));
      setActiveNote(notes.title);
      console.log('active note: ' + activeNote);
    }
  }


  const removeItem = (noteTitle: any) => {
    setNotes(fullNotes.filter(myNotes => myNotes.title !== noteTitle)); //filters out the note with that specific title
    if(activeNote===notes.title){
      setTitle('');
      setContent({value: '', caret: -1, target: null});
      setActiveNote('');
    }
    else{
      console.log('not active note deleted');
      setActiveNote(activeNote);
      console.log('active note is' + activeNote);
    }
    console.log(filePath+notes.title);
    window.electron.ipcRenderer.deleteTextFile(filePath+notes.title);
    toast.info(notes.title + ' deleted');
    //then delete in node js
  };

  return (
      <div className={(activeNote==notes.title)?"sideBarNoteActive":"sideBarNote"} onClick={displayInfo} title={notes.title}>
        <div className='sideBarNoteTitle'>
          <h5>{notes.title}</h5>
        </div>
        <div className='noteButtons'>
          <button className='deleteButton' onClick={()=>removeItem(notes.title)} title="Delete"><TiDelete className='deleteIcon'/></button>
        </div>
        <h6 className="sideBarNoteDate">{notes.dateModified}</h6>
        <ToastContainer autoClose={200} position='bottom-right' theme='dark'/>
      </div>

  )
}

export default SideBarNote;
