import { createContext, useState } from 'react';

export const FilePathContext = createContext({});

type FilePathContextProviderProps = {
    children:React.ReactNode;
}

export const FilePathContextProvider = ({children}:FilePathContextProviderProps) =>{

    const [filePath, setFilePath]= useState('');

    return(
        <FilePathContext.Provider value={{ filePath, setFilePath }}>
            {children}
        </FilePathContext.Provider>
    );
}

