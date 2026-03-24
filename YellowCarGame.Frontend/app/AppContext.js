"use client"
import React, { createContext, useState, useContext } from 'react';
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [response, setResponse] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        response,
        setResponse,
        isLoggedIn,
        setIsLoggedIn,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext)