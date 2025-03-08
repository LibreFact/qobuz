"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const BackgroundContext = createContext<{
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
} | undefined>(undefined);

export const useBackground = () => {
    const context = useContext(BackgroundContext);

    if (!context) {
        throw new Error('useBackground must be used within a SettingsProvider');
    }
    
    return context;
}

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [background, setBackground] = useState("particles");
    
    useEffect(() => {
        const savedBackground = localStorage.getItem('background');
        if (savedBackground && ["particles", "solid color"].includes(savedBackground)) {
            setBackground(savedBackground);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("background", background);
    }, [background]);

    return (
        <BackgroundContext.Provider value={{ background, setBackground }}>
            {children}
        </BackgroundContext.Provider>
    );
};