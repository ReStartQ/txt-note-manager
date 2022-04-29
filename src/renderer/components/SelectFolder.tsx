import React, { ChangeEvent, HTMLAttributes, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { ActiveNoteContext } from "renderer/context/ActiveNoteContext";
import { FilePathContext } from '../context/FilePathContext';
import { AiFillFileAdd, AiFillFolder } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare module 'react' {    
    interface HTMLAttributes<T> {
      // extends React's HTMLAttributes
      directory?: string;
      webkitdirectory?:string;
      notes?:INotes[];
    }
}

interface INotes{
  title:string;
  content:string;
  dateModified:string;
}

interface Props{
  directory: string;
  webkitdirectory:string;
  notes: INotes[];
  setNotes(notes: INotes[]):void;
  content:{
    value:string
  };
  title:string;
  setTitle(title:string):void;
  setContent(content:object):void;
}

let myNotes:INotes[]=([]);
let noteObject: INotes;

let myIterator = 0;
const SelectFolder: React.FC<Props>= ({directory,webkitdirectory,notes,setNotes,content,setContent,title,setTitle})=>{

    const {filePath, setFilePath}:any = useContext(FilePathContext);
    const {activeNote, setActiveNote}:any = useContext(ActiveNoteContext);

    useLayoutEffect( () => {
      window.electron.ipcRenderer.on('getTextFiles', async (message:any)=>{
        if(myNotes.length!=0){
          console.log(message);
          let newArr = [...myNotes]; // copying the old datas array
          newArr[myIterator].dateModified= message[0];
          newArr[myIterator].content= message[1]; 
          console.log(message[0].toString());
          myIterator++;
          setNotes(newArr);
          console.log(message[2]);
          toast.info('Folder selected');
        }
      });
    }, []);


    let isTxtFile = (thisFilePath:string)=>{
      if(thisFilePath.endsWith(".txt")){
        return true;
      }
      else{
        return false;
      }
    }


    let getFileName = (thisFilePath:string) => {
      return thisFilePath.substring(thisFilePath.lastIndexOf('\\')+1);
    }

    const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
      console.log('change');
      if(e.target.files!.length==0){
        console.log('equals 0');
      }
      if(e.target.files!.length>0){
        console.log('greater than 0');
      }
      if(e.target.files!.length!==0){
        myNotes=[];
        setNotes(myNotes);
        for(let i = 0; i<e.target.files!.length; i++){
          if(isTxtFile(e.target.files![i].path)){
            console.log(e.target.files![i].path);
            noteObject = {        
              title: getFileName(e.target.files![i].path.toString()),
              content: " test",
              dateModified: '3/7/2022 at 3:00'
            };
            window.electron.ipcRenderer.getTextFiles(e.target.files![i].path.toString());
            myNotes.push(noteObject);

            let lastIndex = e.target.files![i].path.toString().lastIndexOf('\\')+1;
            console.log(lastIndex);
            let myFilePath = e.target.files![i].path.toString().substring(0,lastIndex);
            setFilePath(myFilePath);
            console.log(filePath);
          }
        }
        setNotes(myNotes);
        let newArr = [...notes]; // copying the old datas array 
        setNotes(newArr);
        myIterator=0;
      }
      else{
        console.log(e.target.files);
        myNotes=[];
        setNotes(myNotes);
        myIterator=0;
        setFilePath('');
        setTitle('');
        setContent({value: '', caret: -1, target: null});
        setActiveNote('');
        toast.warn('No active folder');
      }
    }

    
    useLayoutEffect( () => {
      window.electron.ipcRenderer.on('openUpload', async (message:any)=>{
          console.log('upload window opened');
          document.getElementById('sideBarSelectButton')?.click();
      });
    },[]);

    const inputFile = useRef<HTMLInputElement | null>(null);;
    const onButtonClick = () => {
      // `current` points to the mounted file input element
      inputFile.current?.click();
    };

    return (
          <div className="sideBarSelectFolder">
            <button id="sideBarSelectButton" onClick={()=>{onButtonClick()}} title="Select Folder"><AiFillFolder/>Select Folder</button>
            <input id="sideBarSelect" ref={inputFile} directory={directory} webkitdirectory={webkitdirectory} multiple type="file" accept=".txt"  
              onChange={onFileChange}/>
              <ToastContainer autoClose={200} position='bottom-right' theme='dark' />
          </div>
    )
}

export default SelectFolder;