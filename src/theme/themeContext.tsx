import { APP_COLOR } from '../utils/constant';
import React, { createContext, useState, useContext, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
    colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
        border: string;
        card: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('light');

    const colors = {
        light: {
            background: APP_COLOR.WHITE,
            text: APP_COLOR.BLACK,
            primary: APP_COLOR.BLUE,
            secondary: APP_COLOR.BLUE_LIGHT,
            border: APP_COLOR.GREY,
            card: APP_COLOR.WHITE,
        },
        dark: {
            background: APP_COLOR.BLACK,
            text: APP_COLOR.WHITE,
            primary: APP_COLOR.BLUE,
            secondary:  APP_COLOR.BLUE_LIGHT,
            border: APP_COLOR.GREY,
            card: APP_COLOR.BLACK,
        },
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                colors: colors[theme],
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};