import React, {useState} from 'react';
import Modal from '../../components/Modal/Modal';
import PermissionUser from './PermissionUser';

interface Role {
    id: number;
    name: string;
    description: string;
}

interface RoleManagementTableProps {
    roles: Role[];
    onEdit: (role: Role) => void;
    onCreate: () => void;
}



const RoleManagementTable: React.FC<RoleManagementTableProps> = ({ roles }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleSeing, setRoleSeing] = useState({});

    const handleButtonClick = (role) => {
        setIsModalOpen(true);
        setRoleSeing(role)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const blankRole = {
        id:'',
        rol: 'New Rol',
        identificador:'',
        description: '',
        permissions: {
            "Clientes": { crear: false, editar: false, eliminar: false, ver: false },
            "Pedidos": { crear: false, editar: false, eliminar: false, ver: false },
            "Tarifas y Comisiones": { crear: false, editar: false, eliminar: false, ver: false },
            "Arborescencia": { crear: false, editar: false, eliminar: false, ver: false },
            "Cupones": { crear: false, editar: false, eliminar: false, ver: false },
            "Productos": { crear: false, editar: false, eliminar: false, ver: false },
            "Devoluciones": { crear: false, editar: false, eliminar: false, ver: false },
            "Centro de Mensajería": { crear: false, editar: false, eliminar: false, ver: false },
            "Preguntas Frecuentes": { crear: false, editar: false, eliminar: false, ver: false },
            "Estadísticas": { crear: false, editar: false, eliminar: false, ver: false },
            "Usuarios": { crear: false, editar: false, eliminar: false, ver: false },
            "Roles": { crear: false, editar: false, eliminar: false, ver: false },
            "Lista": { crear: false, editar: false, eliminar: false, ver: false },
            "Centro de Facturación": { crear: false, editar: false, eliminar: false, ver: false },
            "Subastas": { crear: false, editar: false, eliminar: false, ver: false },
            "Marcas": { crear: false, editar: false, eliminar: false, ver: false },
            "Edición Web Pública": { crear: false, editar: false, eliminar: false, ver: false },
            "Menús": { crear: false, editar: false, eliminar: false, ver: false },
            "Ingresos y Egresos": { crear: false, editar: false, eliminar: false, ver: false },
            "Cartera de Clientes": { crear: false, editar: false, eliminar: false, ver: false },
            "Datos de Covende": { crear: false, editar: false, eliminar: false, ver: false },
            "Atributos": { crear: false, editar: false, eliminar: false, ver: false },
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Roles</h2>

                <button
                    onClick={() => handleButtonClick(blankRole)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Crear
                </button>
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Permisos de Rol">
                    <PermissionUser title="New Rol" role={blankRole} />
                </Modal>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.rol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    onClick={() => handleButtonClick(role)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Editar
                                </button>
                                
                            </td>
                        </tr>
                    ))}
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Permisos de Rol">
                                    <PermissionUser title={roleSeing.rol} role={roleSeing} />
                                    <p>mimimi  </p>
                    </Modal>
                </tbody>
            </table>
        </div>
    );
};

export default RoleManagementTable;