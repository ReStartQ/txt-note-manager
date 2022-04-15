import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Main from './components/Main';
import React, { createContext, useEffect, useLayoutEffect, useState } from 'react';
import SideBar from './components/SideBar';
import { v4 as uuidv4 } from 'uuid';
import { FilePathContextProvider } from './context/FilePathContext';
import { ActiveNoteContext, ActiveNoteContextProvider } from './context/ActiveNoteContext';
import { SearchContextProvider } from './context/SearchContext';


uuidv4();

let NoteList:string[];

declare global {
  interface Window {
    electron:any
  }
}


interface INotes{
  title:string;
  content:string;
  dateModified:string;
}

interface IContent{
  value:string;
  caret:number;
  target:any;
}


const NotesApp = () =>{
  const [title,setTitle] = useState<string>("");
  const [content,setContent] = useState<IContent>({value: '', caret: -1, target: null});
  const [notes, setNotes] = useState<INotes[]>([
    /*{
      title: "Testing",
      content: "test content1",
      dateModified: '3/7/2022 at 3:00'
    }*/
  ]);

  const handleContentChange = (e: { target: { value: any; }; }) => { 
    setContent({value: e.target.value, caret: -1, target: e.target});
  };


  useLayoutEffect(() => {

      if(content.caret >= 0){
          content.target.setSelectionRange(content.caret + 4, content.caret + 4);
      }

  }, [content]);

  const handleTab = (e: React.KeyboardEvent) => {

      let etarget = e.target as HTMLInputElement;
      let content = etarget.value;
      let caret   = etarget.selectionStart;

      if(e.key === 'Tab'){
          e.preventDefault();

          let newText = content.substring(0, caret!) + '    ' + content.substring(caret!);

          setContent({value: newText, caret: caret!, target: e.target});

      }

  }


  

  return (
    <SearchContextProvider>
    <ActiveNoteContextProvider>
    <FilePathContextProvider>
      <div className="container">
          <SideBar notes={notes} setNotes={setNotes} title={title} content={content} setTitle={setTitle} setContent={setContent}/>
          <Main title={title} content={content} setTitle={setTitle} setContent={handleContentChange} handleTab={handleTab}/>
      </div>
    </FilePathContextProvider>
    </ActiveNoteContextProvider>
    </SearchContextProvider>
  );
}


const App = () =>{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotesApp />} />
      </Routes>
    </Router>
  );
}


export default App;
