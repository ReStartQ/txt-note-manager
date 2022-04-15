import { createContext, useState } from 'react';

export const SearchContext = createContext({});

type SearchContextProviderProps = {
    children:React.ReactNode;
}

export const SearchContextProvider = ({children}:SearchContextProviderProps) =>{

    const [search, setSearch]= useState('');

    return(
        <SearchContext.Provider value={{search,setSearch}}>
            {children}
        </SearchContext.Provider>
    );
}
