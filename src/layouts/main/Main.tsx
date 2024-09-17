import React from 'react';
import { Outlet } from 'react-router-dom';

const Main: React.FC = () => {
    return (
        <main className="p-4 flex-1 overflow-auto transition-all duration-500 ease-in-out">
            {/* <TipoRecursoComponent /> */}
            pipopipo
            <Outlet />
        </main>
    );
};

export default Main;