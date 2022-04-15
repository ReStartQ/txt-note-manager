import React from "react";

class TxtNote {
    content: string;
    date: number[];
    time: number[];
   
    constructor(content: string, date:number[], time:number[]) {
      this.content=content;
      this.date=date;
      this.time=time;
    }
   
    get Content() {
      return this.content;
    }
  
    get Date(){
      return this.date;
    }
  
    get Time(){
      return this.time;
    }
  
    set Content(val){
      this.content=val;
    }
  
    set Date(val){
      this.date=val;
    }
  
    set Time(val){
      this.time=val;
    }
}

interface NotesInterface{
    notes: {
      title:string;
      content:string;
      dateModified:number[];
    }
}

interface INoteProps{
    test:string;
}

class Note extends React.Component<INoteProps>{
    render() {
      return (
          <button>{this.props.test}</button>
      );
    }
}



export default Note;