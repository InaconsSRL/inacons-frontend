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
import AlmacenBoardPage from './pages/AlmacenesPage/AlmacenBoard/AlmacenBoardPage';
import Presupuestos from './pages/PresupuestosDemo/Presupuestos';
import TipoAlmacenPage from './pages/TipoAlmacenPage/TipoAlmacenPage';
import ObrasComponent from './pages/ObrasPage/ObrasPage';
import ComprasBoard from './pages/ComprasPage/ComprasBoard';
import OrdenCompraPage from './pages/OrdenCompraPage/OrdenCompraPage';
import OrdenPagoPage from './pages/OrdenPagoPage/OrdenPagoPage';
import DescuentoPagoPage from './pages/OrdenPagoPage/DescuentosPagoPage';

import HomologacionFormPage from './pages/ProveedorPage/Forms/HomologacionForm';
import AlmacenBetha from './pages/AlmacenesPage/AlmacenBoard/AlmacenBetha';
import EmpleadosPage from './pages/EmpleadosPage/EmpleadosPage';
import SorteoPage from './pages/HomePage/Sorteo';
import BodegasComponent from './pages/BodegasPage/BodegasComponent';
import LoaderOverlay from './components/Loader/LoaderOverlay';

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Routes >
      <Route path="/login" element={<Login />} />
      <Route path="/proveedor-registro" element={<HomologacionFormPage />} />
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
        <Route path="almacen" element={<BodegasComponent />}> </Route>
        <Route path="almacenBoard" element={<AlmacenBoardPage />}> </Route>
        <Route path="presupuestoBoard" element={<Presupuestos />}> </Route>
        <Route path="compras" element={<ComprasBoard />}> </Route>
        <Route path="tipoAlmacen" element={<TipoAlmacenPage />}> </Route>
        <Route path="obras" element={<ObrasComponent />}> </Route>
          <Route path="ordenCompra" element={<OrdenCompraPage />}> </Route>
	  <Route path="ordenPago" element={<OrdenPagoPage />}> </Route>
      <Route path="orden-pago" element={<Navigate to="/dashboard/ordenPago" replace />} />
	<Route path="almacenbetha" element={<AlmacenBetha />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="sorteo" element={<SorteoPage />} />
        <Route path="loader" element={<LoaderOverlay />} />

      </Route>
      <Route path="/" element={
        user.token ? 
        <Navigate to="/dashboard" replace /> : 
        <Navigate to="/login" replace />
      } />
    </Routes> 
  );
};

const AppWrapper: React.FC = () => (
  <Router 
  future={{//salia error, este codigo prepara la app para la version 7 de react-router
    v7_startTransition: true, v7_relativeSplatPath: true
    }}>
    <App />
  </Router>
);

export default AppWrapper;
