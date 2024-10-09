import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification } from '../types';

interface OrganigramaContextType {
    notification: Notification | null;
    showNotification: (message: string, type: 'error' | 'success' | 'info') => void;
}

const OrganigramaContext = createContext<OrganigramaContextType | undefined>(undefined);

export const OrganigramaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
    }, []);

    const showNotification = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <OrganigramaContext.Provider value={{ notification, showNotification }}>
            {children}
        </OrganigramaContext.Provider>
    );
};

export const useOrganigramaContext = () => {
    const context = useContext(OrganigramaContext);
    if (context === undefined) {
        throw new Error('useOrganigramaContext must be used within a OrganigramaProvider');
    }
    return context;
};