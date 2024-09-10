import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import Header from '../header/Header'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../footer/Footer'
import Main from '../main/Main'

import bg from '../../assets/bgmedia.webp'

import RoleManagementTable from '../../pages/usuarios/RoleManagementTable';

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


const roles = [
    {
        id: 1,
        rol: 'Gestor de pedidos',
        identificador:'Gestor de pedidos',
        description: 'Sub cuenta vendedor encargado de gestionar pedidos.',
        permissions: {
            "Clientes": { crear: true, editar: false, eliminar: true, ver: false },
            "Pedidos": { crear: false, editar: true, eliminar: false, ver: true },
            "Tarifas y Comisiones": { crear: true, editar: false, eliminar: false, ver: true },
            "Arborescencia": { crear: false, editar: true, eliminar: true, ver: false },
            "Cupones": { crear: true, editar: false, eliminar: true, ver: true },
            "Productos": { crear: false, editar: true, eliminar: false, ver: true },
            "Devoluciones": { crear: true, editar: false, eliminar: true, ver: false },
            "Centro de Mensajería": { crear: false, editar: true, eliminar: false, ver: true },
            "Preguntas Frecuentes": { crear: true, editar: false, eliminar: true, ver: false },
            "Estadísticas": { crear: false, editar: true, eliminar: false, ver: true },
            "Usuarios": { crear: true, editar: false, eliminar: true, ver: true },
            "Roles": { crear: false, editar: true, eliminar: false, ver: false },
            "Lista": { crear: true, editar: false, eliminar: true, ver: true },
            "Centro de Facturación": { crear: false, editar: true, eliminar: false, ver: true },
            "Subastas": { crear: true, editar: false, eliminar: true, ver: false },
            "Marcas": { crear: false, editar: true, eliminar: false, ver: true },
            "Edición Web Pública": { crear: true, editar: false, eliminar: true, ver: false },
            "Menús": { crear: false, editar: true, eliminar: false, ver: true },
            "Ingresos y Egresos": { crear: true, editar: false, eliminar: true, ver: false },
            "Cartera de Clientes": { crear: false, editar: true, eliminar: false, ver: true },
            "Datos de Covende": { crear: true, editar: false, eliminar: true, ver: false },
            "Atributos": { crear: false, editar: true, eliminar: false, ver: true },
        }
    },
    {
        id: 2,
        rol: 'Gestor de facturación',
        identificador:'Gestor de facturación',
        description: 'Sub cuenta vendedor encargado de gestionar facturas.',
        permissions: {
            "Clientes": { crear: false, editar: true, eliminar: false, ver: true },
            "Pedidos": { crear: true, editar: false, eliminar: true, ver: false },
            "Tarifas y Comisiones": { crear: false, editar: true, eliminar: false, ver: true },
            "Arborescencia": { crear: true, editar: false, eliminar: true, ver: false },
            "Cupones": { crear: false, editar: true, eliminar: false, ver: true },
            "Productos": { crear: true, editar: false, eliminar: true, ver: false },
            "Devoluciones": { crear: false, editar: true, eliminar: false, ver: true },
            "Centro de Mensajería": { crear: true, editar: false, eliminar: true, ver: false },
            "Preguntas Frecuentes": { crear: false, editar: true, eliminar: false, ver: true },
            "Estadísticas": { crear: true, editar: false, eliminar: true, ver: false },
            "Usuarios": { crear: false, editar: true, eliminar: false, ver: true },
            "Roles": { crear: true, editar: false, eliminar: true, ver: false },
            "Lista": { crear: false, editar: true, eliminar: false, ver: true },
            "Centro de Facturación": { crear: true, editar: false, eliminar: true, ver: false },
            "Subastas": { crear: false, editar: true, eliminar: false, ver: true },
            "Marcas": { crear: true, editar: false, eliminar: true, ver: false },
            "Edición Web Pública": { crear: false, editar: true, eliminar: false, ver: true },
            "Menús": { crear: true, editar: false, eliminar: true, ver: false },
            "Ingresos y Egresos": { crear: false, editar: true, eliminar: false, ver: true },
            "Cartera de Clientes": { crear: true, editar: false, eliminar: true, ver: false },
            "Datos de Covende": { crear: false, editar: true, eliminar: false, ver: true },
            "Atributos": { crear: true, editar: false, eliminar: true, ver: false },
        }
    },
];

<RoleManagementTable
    roles={roles}
    onEdit={(role) => console.log('Editando:', role)}
    onCreate={() => console.log('Creando nuevo rol')}
/>


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
                    <Main />                    
                </div>
                <Footer />
            </div>
        </motion.div>
    );
};

export default Dashboard;
