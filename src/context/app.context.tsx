import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string;
    createdAt: string;
    avatar?: string;
}

interface AppContextType {
    user: UserData | null;
    setUser: (user: UserData) => void;
    updateUser: (updates: Partial<UserData>) => void;
    clearUser: () => void;
    isLoggedIn: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);

    const updateUser = (updates: Partial<UserData>) => {
        if (user) {
            setUser({ ...user, ...updates });
        }
    };

    const clearUser = () => {
        setUser(null);
    };

    return (
        <AppContext.Provider 
            value={{ 
                user, 
                setUser, 
                updateUser,
                clearUser,
                isLoggedIn: user !== null 
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};