import React from 'react';
import { Outlet } from 'react-router-dom';
import CalendarPage from '../../pages/CalendarPage/CalendarPage';

const Main: React.FC = () => {
    return (
        <main className="p-4 flex-1 overflow-auto transition-all duration-500 ease-in-out">
            <CalendarPage />
            <Outlet />
        </main>
    );
};

export default Main;