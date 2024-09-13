import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/iniciar-sesion/Login';
import Dashboard from './layouts/dashboard/Dashboard';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import TipoRecursoComponent from './pages/TipoRecurso/TipoRecursoPage';
import CargosComponent from './pages/Cargos/CargosComponent';
import RecursosPage from './pages/Recursos/RecursosPage';

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={user.token ? <Dashboard /> : <Login to="/" />}>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="tipoRecurso" element={<TipoRecursoComponent />} />
          <Route path="cargo" element={<CargosComponent />} />
          <Route path="recurso" element={<RecursosPage />} />
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