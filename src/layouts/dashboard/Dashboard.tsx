import React, {useState} from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

import bg from '../../assets/bgmedia.webp'

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <main 
                    className={`flex-1 overflow-auto transition-all duration-500 ease-in-out ${
                        isSidebarOpen ? 'ml-64' : 'ml-16'
                    }`}
                    
                >
                    <div className="p-4">
                        <h1 className="text-white">Contenido principal</h1>
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
