import React from 'react';
import MainContent from './MainContent';
import MainTitle from './MainTitle';

interface IMainProps{
  content:{
    value:string
  };
  title:string;
  setTitle(title:string):void;
  setContent(content:object):void;
  handleTab(e:React.KeyboardEvent):void;
}

const Main: React.FC<IMainProps> = (props: IMainProps)=>{
  return (
    <div className='main'>
      <MainTitle title={props.title} setTitle={props.setTitle}/>
      <MainContent content={props.content} setContent={props.setContent} handleTab={props.handleTab}/>
    </div>
  )
}

export default Main;