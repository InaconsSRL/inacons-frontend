import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './pages/iniciar-sesion/Login';
import Usuarios from './pages/usuarios/Usuarios';
import Dashboard from './layouts/dashboard/Dashboard';
import { useSelector } from 'react-redux';
import {RootState} from './store/store';


const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();
  
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={user.token ? <Dashboard /> : <Login to="/" />} >
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </AnimatePresence>
    );
  };
  
  const AppWrapper: React.FC = () => (
    <Router>
      <App />
    </Router>
  );
  
  export default AppWrapper;

