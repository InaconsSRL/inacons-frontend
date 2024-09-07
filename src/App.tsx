import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Login from './pages/iniciar-sesion/Login';
import Usuarios from './pages/usuarios/Usuarios';
import Dashboard from './layouts/dashboard/Dashboard';
import { useSelector } from 'react-redux';
import {RootState} from './store/store';

const App: React.FC = () => {
   const user = useSelector((state: RootState) => state.user); 

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/" element={<Dashboard />} /> */}
                {/* <Route path="/dashboard" element={user.token ? <Dashboard /> : <Navigate to="/" />} >
                    <Route path="usuarios" element={<Usuarios />} />
                </Route> */}
            </Routes>
        </Router>
    );
};



export default App
