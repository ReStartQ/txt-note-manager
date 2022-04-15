import React from 'react'

interface IMainTitleProps{
    title:string;
    setTitle(title:string):void;
}

const MainTitle: React.FC<IMainTitleProps> = (props: IMainTitleProps)=>{
    let handleKeyDown = (e: { key: string; preventDefault: () => void; })=>{
        if(e.key==="<"||e.key===">"||e.key===":"||e.key==="\""||e.key==="/"||e.key==="\\"||e.key==="\|"||e.key==="?"||e.key==="*"){
            e.preventDefault();
        }
    }
    let changeTitle = (e: { target: { value: string; }; }) =>{
        props.setTitle(e.target.value);
    }
    return (
        <div className='mainTitle'>
            <input type="text" id='noteTitle' onKeyDown={handleKeyDown} spellCheck="false" onChange={changeTitle}value={props.title}/>
        </div>
    )
}

export default MainTitle;