// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../store/store';
// import Button from '../../components/Buttons/Button';
// import { IProyecto } from '../../types/gestionTypes';
// import { fetchProyectos } from '../../slices/proyectosSlice';
// import { setActiveProyecto } from '../../slices/activeDataSlice';
// import { FiCalendar, FiPlus, FiUser, FiGrid, FiList, FiEdit } from 'react-icons/fi';
// import { AiFillFolderOpen } from 'react-icons/ai';
// import { BsFillBuildingFill } from 'react-icons/bs';

// interface ProyectoSelectorProps {
//   onCreateNew: () => void;
//   onEdit: (proyecto: IProyecto) => void;
// }

// const ProyectoSelector: React.FC<ProyectoSelectorProps> = ({ onCreateNew, onEdit }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { proyectos, status } = useSelector((state: RootState) => state.proyectos);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');

//   useEffect(() => {
//     dispatch(fetchProyectos());
//   }, [dispatch]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const handleProyectoSelect = (proyecto: IProyecto) => {
//     dispatch(setActiveProyecto(proyecto));
//   };

//   const filteredProyectos = proyectos.filter(proyecto =>
//     selectedCategory === 'all' || proyecto.estado === selectedCategory
//   );

//   return (
//     <div className="h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-br from-gray-900 to-navy-900">
//       {/* Header con efecto glassmorphism */}
//       <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-8">
//               <h1 className="text-3xl font-bold text-white">Workspace</h1>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400'}`}
//                 >
//                   <FiGrid size={20} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400'}`}
//                 >
//                   <FiList size={20} />
//                 </button>
//               </div>
//             </div>
//             <Button
//               onClick={onCreateNew}
//               className="bg-green-500 hover:bg-emerald-400 text-black hover:text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 w-40"
//               icon={FiPlus}
//               text="Crear Proyecto"
//               color='verde'
//             />
//           </div>

//           {/* Filtros */}
//           <div className="flex space-x-4 mt-6 pb-4">
//             {['all', 'PLANTILLA', 'ACTIVO', 'COMPLETADO'].map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedCategory === category
//                     ? 'bg-white/20 text-white'
//                     : 'text-gray-400 hover:text-white hover:bg-white/10'
//                   }`}
//               >
//                 {category === 'all' ? 'Todos' : category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Contenido */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           {status === 'loading' ? (
//             <div className="flex flex-col items-center justify-center h-96">
//               <div className="relative w-24 h-24">
//                 <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-pulse"></div>
//                 <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
//               </div>
//               <p className="mt-6 text-gray-400 text-lg">Cargando proyectos...</p>
//             </div>
//           ) : (
//             <div className={viewMode === 'grid' ?
//               "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " :
//               "space-y-4 "
//             }>
//               {filteredProyectos.map((proyecto: IProyecto) => (
//                 <div
//                   key={proyecto.id_proyecto}
//                   className={`group relative transition-all duration-500 ${viewMode === 'grid'
//                       ? 'transform hover:-translate-y-2'
//                       : 'transform hover:translate-x-2'
//                     }`}
//                 >
//                   <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden border border-white/20 hover:border-white/40">
//                     {/* Botones de acción - Ahora fuera del área clicable */}
//                     <div
//                       className="absolute top-2 right-2 flex space-x-2 z-10"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <button
//                         onClick={() => onEdit(proyecto)}
//                         className="py-1 px-2 bg-blue-500/80 hover:bg-blue-400 text-white rounded-lg transition-all duration-300"
//                       >
//                         <FiEdit size={16} />
//                       </button>
//                     </div>
//                     <div className="absolute bottom-6 right-2 flex space-x-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${proyecto.estado === 'ACTIVO'
//                           ? 'bg-emerald-500/80 text-emerald-100 ring-1 ring-emerald-500/40'
//                           : proyecto.estado === 'PLANTILLA'
//                             ? 'bg-yellow-500/80 text-yellow-100 ring-1 ring-yellow-500/40'
//                             : 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/40'
//                         }`}>
//                         {proyecto.estado}
//                       </span>
//                     </div>

//                     <div
//                       onClick={() => handleProyectoSelect(proyecto)}
//                       className="pt-5 px-5 bg-white/10 backdrop-blur-xl"
//                     >


//                       <div className="mb-0">
//                         <h3 className={`text-xl font-semibold text-white ${viewMode !== "grid" ? "" : "mt-3"} mb-0 truncate`}>
//                           {proyecto.nombre_proyecto}
//                         </h3>
//                         <p className="text-gray-400 text-sm flex items-center mb-1">
//                           <AiFillFolderOpen className="mr-2" />
//                           {proyecto.id_proyecto}
//                         </p>
//                       </div>

//                       <div className="-space-y-0">
//                         <div className="flex items-center text-gray-300">
//                           <BsFillBuildingFill className="w-4 h-4 mr-3 text-blue-400" />
//                           <div className='flex items-center space-x-2'>
//                             <span className='w-20 font-bold text-blue-400'>Empresa:</span><span>{proyecto.empresa}</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center text-gray-300">
//                           <FiUser className="w-4 h-4 mr-3 text-blue-400" />
//                           <div className='flex items-center space-x-2'>
//                             <span className='w-20 font-bold text-blue-400'>Cliente:</span><span>{proyecto.cliente}</span></div>
//                         </div>
//                         <div className="flex items-center text-gray-300">
//                           <FiCalendar className="w-4 h-4 mr-3 text-blue-400" />
//                           <div className='flex items-center space-x-2'>
//                             <span className='w-20 font-bold text-blue-400'>F Inicio:</span><span>{formatDate(proyecto.fecha_creacion)}</span></div>
//                         </div>
//                       </div>
//                       {/* Barra de progreso decorativa */}
//                       <div className="mt-6">
//                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 group-hover:w-full"
//                             style={{ width: `${Math.random() * 100}%` }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProyectoSelector;