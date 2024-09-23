// import React, { useState, ChangeEvent } from "react";

// interface PermissionUserProps {
//   title:string,
//   role: {
//     id: number;
//     rol: string;
//     identificador: string;
//     description: string;
//     permissions: Permissions;
//   };
//   onClose: () => void;
// }

// interface Permissions {
//   [key: string]: {
//     crear: boolean;
//     editar: boolean;
//     eliminar: boolean;
//     ver: boolean;
//   };
// }

// type PermissionAction = 'crear' | 'editar' | 'eliminar' | 'ver';

// interface FormData {
//   rol: string;
//   identificador: string;
//   description: string;
//   permisos: Permissions;
// }

// const PermissionUser: React.FC<PermissionUserProps> = ({ title, role }) => {
//   const [formData, setFormData] = useState<FormData>({
//     rol: role.rol,
//     identificador: role.identificador,
//     description: role.description,
//     permisos: role.permissions,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePermissionChange = (permission: string, action: PermissionAction) => {
//     setFormData((prev) => ({
//       ...prev,
//       permisos: {
//         ...prev.permisos,
//         [permission]: {
//           ...prev.permisos[permission],
//           [action]: !prev.permisos[permission][action],
//         },
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     {/* Esperando API para enviar a base de datos */}
//   };

//   return (
//     <div className="bg-white min-w-52 max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl p-8 overflow-y-auto">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

//       <div className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rol">
//             Rol
//           </label>
//           <input
//             id="rol"
//             type="text"
//             name="rol"
//             value={formData.rol}
//             onChange={handleChange}
//             placeholder="Ej: Editor"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="identificador">
//             Identificador
//           </label>
//           <input
//             id="identificador"
//             type="text"
//             name="identificador"
//             value={formData.identificador}
//             onChange={handleChange}
//             placeholder="Ej: EDITOR_001"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
//             Descripción
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Describe las responsabilidades y alcance del rol"
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           ></textarea>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Permisos</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {['Permiso', 'Crear', 'Editar', 'Eliminar', 'Ver'].map((header) => (
//                   <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {Object.keys(formData.permisos).map((permission) => (
//                 <tr key={permission}>
//                   <td className="px-6 py-0.5 whitespace-nowrap text-sm font-medium text-gray-900">{permission}</td>
//                   {(['crear', 'editar', 'eliminar', 'ver'] as PermissionAction[]).map((action) => (
//                     <td key={action} className="text-center whitespace-nowrap text-sm text-gray-500">
//                       <input
//                         type="checkbox"
//                         checked={formData.permisos[permission][action]}
//                         onChange={() => handlePermissionChange(permission, action)}
//                         className="h-4 w-4 text-center text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                     </td>
//                   ))}                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mt-8 flex justify-end">
//         <button
//           onClick={handleSubmit}
//           className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//         >
//           Guardar Cambios
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PermissionUser;