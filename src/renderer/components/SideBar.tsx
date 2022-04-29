import React, { useContext, useLayoutEffect, useState } from "react"
import { ActiveNoteContext } from "renderer/context/ActiveNoteContext";
import { FilePathContext } from "renderer/context/FilePathContext";
import SearchFilter from "./SearchFilter";
import SelectFolder from "./SelectFolder";
import SideBarNotes from "./SideBarNotes";
import Notification from "./Notification";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiSave } from "react-icons/bi";
import { IoIosSave } from "react-icons/Io";
import { AiFillFileAdd, AiFillFolder, AiTwotoneSave } from "react-icons/ai";
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





const SideBar: React.FC<Props> = ({notes, setNotes, title, setTitle, content, setContent})=>{
    
    const {filePath, setFilePath}:any = useContext(FilePathContext);
    const {activeNote, setActiveNote}:any = useContext(ActiveNoteContext);
    const [clickedSave, setClickedSave] = useState(true);
    const [clickedAdd, setClickedAdd] = useState(true);
    const [rendered, setRendered] = useState(false);
    

    let myNewNote = {
        title:'New Text Document.txt',
        content:'',
        dateModified: new Date().toLocaleDateString() + ', ' + new Date().toLocaleTimeString()
    }

    let myNotesCopy = [...notes];

    useLayoutEffect( () => {
        window.electron.ipcRenderer.once('addTextFile', async (message:any)=>{
            console.log(message);
            myNewNote.title=message[1];
            myNewNote.dateModified=message[2] + ', ' + message[3];
            console.log(message[2]);
            console.log(message[3]);
            setNotes([myNewNote, ...notes]);
        });
    },[clickedAdd]);

    useLayoutEffect( () => {
        if(rendered){
            window.electron.ipcRenderer.once('saveTextFile', async (message:any)=>{
                if(message[4]==true){
                    toast.warn('Note saved with a different name');
                }
                else{
                    toast.success("Saving");
                }
                //Logic
                //ActiveNote changes to the current title 
                //Notes[i] changes to have the properties where, title: current title, content: {content:null, etc}, dateModified: date from nodejs
                let notesIndex = notes.findIndex(obj => obj.title===activeNote); //old name should be message[5]
                console.log(notesIndex);
                let NotesCopy = [...notes];
                NotesCopy[notesIndex].title=message[5];
                NotesCopy[notesIndex].content=content.value;
                console.log(message[6].mtime);
                NotesCopy[notesIndex].dateModified=message[6].mtime.toLocaleDateString() + ', ' + message[6].mtime.toLocaleTimeString();
                setTitle(message[5].substring(0,message[5].length-4));
                setNotes(NotesCopy);
                setActiveNote(message[5]);
                console.log(notes);
                console.log(message);
            });
        }
        else{
            setRendered(!rendered);
        }
    },[clickedSave]);





    let addNotes = ()=>{
        //note should be named New Text Document.txt
        //also check for numbers (1), if the name is taken
        //if file path is not empty, then make a new txt note file in that file location
        if(filePath!=""){
            console.log(filePath + myNewNote.title);
            window.electron.ipcRenderer.addTextFile(filePath + myNewNote.title);
            toast.success("New txt file");
            setClickedAdd(!clickedAdd);
        }
        else{
            toast.warn('Select a non-empty Folder');
        }
    }

    let saveNotes = ()=>{
        console.log(filePath);
        console.log(activeNote);
        if(filePath!=''&&activeNote!=''){
            console.log(filePath+activeNote);
            console.log(title);
            console.log(content);
            window.electron.ipcRenderer.saveTextFile([filePath,activeNote,title,content.value]); //file path, title, content
            setClickedSave(!clickedSave);
        }
        else{
            console.log('nothing to save');
            toast.warn('No note is selected');
        }
        //also filter notes to find active note and then update it
        //if save with no title change and content change
        //if save with title change and content change
    }

    useLayoutEffect( () => {
        window.electron.ipcRenderer.on('clickSave', async (message:any)=>{
            console.log('save click');
            document.getElementById('saveButton')?.click();
        });
        window.electron.ipcRenderer.on('clickAdd', async (message:any)=>{
            console.log('add click');
            document.getElementById('addButton')?.click();
        });
    },[]);

    return (
        <div className='sideBar'> 
            <SelectFolder directory={""} webkitdirectory={"true"} notes={notes} setNotes={setNotes} title={title} setTitle={setTitle} content={content} setContent={setContent}/>          
            <div className="sideBarButtons">
                <button id='addButton' className="addButton" onClick={()=>{addNotes()}} title="Add"><AiFillFileAdd/>New File</button>
                <button id='saveButton' className='saveButton' onClick={()=>{saveNotes()}} title="Save"><IoIosSave/>Save</button>
            </div>
            <SearchFilter notes={notes} setNotes={setNotes}/>      
            <SideBarNotes notes={notes} setNotes={setNotes} title={title} setTitle={setTitle} content={content} setContent={setContent}/>
            <ToastContainer autoClose={200} position='bottom-right' theme='dark'/>
        </div>

    )
}

export default SideBar;