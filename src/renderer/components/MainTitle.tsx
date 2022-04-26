import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IMainTitleProps{
    title:string;
    setTitle(title:string):void;
}

const MainTitle: React.FC<IMainTitleProps> = (props: IMainTitleProps)=>{
    let handleKeyDown = (e: { key: string; preventDefault: () => void; })=>{
        if(e.key==="<"||e.key===">"||e.key===":"||e.key==="\""||e.key==="/"||e.key==="\\"||e.key==="\|"||e.key==="?"||e.key==="*"){
            e.preventDefault();
            //'A file name cant contain any of the following characters:' + '\n ' + '/ : * ? " < > |'
            toast.error(<div>A file name cant contain any of the following characters: <br /> \ / : * ? " &#60; 	&#62; | </div>);
        }
    }
    let changeTitle = (e: { target: { value: string; }; }) =>{
        props.setTitle(e.target.value);
    }
    return (
        <div className='mainTitle'>
            <input type="text" id='noteTitle' onKeyDown={handleKeyDown} spellCheck="false" onChange={changeTitle}value={props.title}/>
            <ToastContainer autoClose={200} position='bottom-right' theme='dark'/>
        </div>
    )
}

export default MainTitle;