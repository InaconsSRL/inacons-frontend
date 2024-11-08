import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

import Login from './pages/IniciarSesionPage/Login';
import Dashboard from './layouts/dashboard/Dashboard';
import HomePage from './pages/HomePage/HomePage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import TipoRecursoComponent from './pages/TipoRecursoPage/TipoRecursoPage';
import CargosComponent from './pages/CargosPage/CargosComponent';
import RecursosPage from './pages/RecursosPage/RecursosPage';
import UsuariosPage from './pages/UsuariosPage/UsuariosPage';
import UnidadPage from './pages/UnidadPage/UnidadPage';
import ClasificacionRecursoComponent from './pages/ClasificacionRecursoPage/ClasificacionRecursoComponent';
import Organigrama from './pages/OrganigramaPage/OrganigramaController';
import RolesPage from './pages/RolePage/RolesPage';
import KanbanBoard from './pages/KanBanBoard/KanbanBoard';
import ProveedorComponent from './pages/ProveedorPage/ProveedorComponent';
import RequerimientosComponent from './pages/RequerimientosPage/RequerimientosComponent';
import TipoCostoRecursoComponent from './pages/TipoCostoRecursoPage/TipoCostoRecursoComponent';
import RequermientoRecursos from './pages/RequerimientosPage/CrearRequerimientoYRecursos/RequerimientoRecursos';
import AlmacenesComponent from './pages/AlmacenesPage/AlmacenesComponent';
import AlmacenBoardPage from './pages/AlmacenesPage/AlmacenBoard/AlmacenBoardPage';
import { Presupuestos } from './pages/PresupuestosDemo/Presupuestos';
import ComprasPage from './pages/ComprasPage/ComprasPage';

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
        <Route path="unidad" element={<UnidadPage />} />
        <Route path="clasificacionRecurso" element={<ClasificacionRecursoComponent />} />
        <Route path="organigrama" element={<Organigrama />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="kanban" element={<KanbanBoard />} />
        <Route path="proveedor" element={<ProveedorComponent />} />
        <Route path="requerimiento" element={<RequerimientosComponent />} />
        <Route path="tipoCostoRecurso" element={<TipoCostoRecursoComponent />} />
        <Route path="reqRecursos" element={<RequermientoRecursos onClose={() => {}} />} />
        <Route path="almacen" element={<AlmacenesComponent />}> </Route>
        <Route path="almacenBoard" element={<AlmacenBoardPage />}> </Route>
        <Route path="presupuestoBoard" element={<Presupuestos />}> </Route>
        <Route path="compras" element={<ComprasPage />}> </Route>
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