import React from 'react';
// import { Link, Outlet } from 'react-router-dom';
import FilterBar from './FilterBar';
import { Outlet } from 'react-router-dom';
import Button from '../../components/Buttons/Button';

const Header: React.FC = () => {

    return (
        <main className={`p-4 flex-1 overflow-auto transition-all duration-500 ease-in-out`}>
            <div className="flex flex-col h-screen">
                {/* Section A: Titles */}
                <header className="bg-white p-2 shadow-md rounded-xl h-16">
                    <nav className="flex items-center space-x-4">
                        <a href="#" className="text-gray-600">Mi calendario</a>
                        <a href="#" className="text-blue-600 font-medium">Calendario de la compañía</a>
                        <a href="#" className="text-gray-600">Disponibilidad de la sala de reuniones</a>
                        <div className="flex-grow"></div>
                        <button className="text-gray-600">Más</button>
                    </nav>
                </header>

                {/* Section B: Subtitles */}
                <div className="x text-white p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Calendario ☼</h1>
                    <div className="flex space-x-2">
                        <Button text='Terminar' />
                        <div className="relative">
                            <input type="text" placeholder="Filtrar y buscar" className="bg-white/10 text-white/80 hover:bg-white hover:text-black active:bg-red-500   px-4 py-2 rounded" />
                            <span className="absolute right-3 top-2">🔍</span>
                        </div>

                        <Button color='transp' text='Calendarios' />
                        <Button color='transp' text='⚙️' />
                    </div>
                </div>
                <div className="x text-white p-4 flex items-center justify-between">
                    <FilterBar />
                </div>

                <div className="flex flex-1 overflow-hidden rounded-xl">
                    {/* Section C: Tables */}
                    <main className="flex-grow p-4 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl">Septiembre, 2024</h2>
                            <div className="flex items-center space-x-2">
                                <button>Programar</button>
                                <button>&lt; Hoy &gt;</button>
                            </div>
                        </div>
                        <div className="border rounded-lg h-full">
                            {/* Calendar grid would go here */}
                        </div>
                    </main>

                    {/* Section D: Samples */}
                    <aside className="w-64 p-4 bg-gray-100">
                        <div className="text-center">
                            &lt; Septiembre 2024 &gt;
                        </div>
                        {/* Mini calendar would go here */}
                    </aside>
                </div>
            </div>

            <Outlet />
        </main>
    );
};

export default Header;
