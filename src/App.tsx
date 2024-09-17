import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

import Login from './pages/iniciar-sesion/Login';
import Dashboard from './layouts/dashboard/Dashboard';
import HomePage from './pages/HomePage/HomePage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import TipoRecursoComponent from './pages/TipoRecurso/TipoRecursoPage';
import CargosComponent from './pages/Cargos/CargosComponent';
import RecursosPage from './pages/Recursos/RecursosPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={user.token ? <Dashboard /> : <Navigate to="/login" replace />}
      >
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="tipoRecurso" element={<TipoRecursoComponent />} />
        <Route path="cargo" element={<CargosComponent />} />
        <Route path="recurso" element={<RecursosPage />} />
        <Route path="usuario" element={<UsuariosPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;