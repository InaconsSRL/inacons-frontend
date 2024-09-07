import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import Header from '../header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../footer/Footer'
import Main from '../main/Main'

import bg from '../../assets/bgmedia.webp'
import blanco from "../../assets/blanco.jpg"

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
            <div className="flex flex-1 overflow-hidden pt-16 mb-12">
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <Main />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
