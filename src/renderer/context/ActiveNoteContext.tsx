import { createContext, useState } from 'react';

export const ActiveNoteContext = createContext({});

type ActiveNoteContextProviderProps = {
    children:React.ReactNode;
}

export const ActiveNoteContextProvider = ({children}:ActiveNoteContextProviderProps) =>{

    const [activeNote, setActiveNote]= useState('');

    return(
        <ActiveNoteContext.Provider value={{activeNote,setActiveNote}}>
            {children}
        </ActiveNoteContext.Provider>
    );
}

