import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Outlet } from 'react-router-dom';

import Header from '../header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../footer/Footer';

import bg from '../../assets/bgmedia.webp';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="flex flex-col h-screen" style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1 overflow-hidden pt-16 mb-12">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div className="p-4 flex-1 overflow-auto transition-all duration-500 ease-in-out">
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </motion.div>
  );
};

export default Dashboard;