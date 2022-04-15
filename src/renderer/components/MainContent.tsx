import React, { ChangeEvent, useState } from 'react'

interface IMainContentProps{
    content:{
        value:string
    };
    setContent(content:object):void;
    handleTab(e:React.KeyboardEvent):void;
}

const MainContent: React.FC<IMainContentProps> = (props: IMainContentProps)=>{
    return (
        <div className='mainContent'>
            <textarea className='mainArea' name="main" spellCheck="false" 
                value={props.content.value}
                onChange={props.setContent}
                onKeyDown={props.handleTab}>
            </textarea>
        </div>
    )
}

export default MainContent;

