import React from 'react';
import { Outlet } from 'react-router-dom';
import CalendarPage from '../../pages/CalendarPage/CalendarPage';
import CargosComponent from '../../pages/Cargos/CargosComponent';
import TipoRecursoComponent from '../../pages/TipoRecurso/TipoRecursoPage';


const Main: React.FC = () => {
    return (
        <main className="p-4 flex-1 overflow-auto transition-all duration-500 ease-in-out">
            {/* <TipoRecursoComponent /> */}
            <Outlet />
        </main>
    );
};

export default Main;