// import React, { useEffect } from 'react';
// import ListaProyectos from './ListaProyectos';
// import { clearActiveComposicionApu, clearActivePresupuesto, clearActiveProyecto } from '../../../slices/activeDataSlice'
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store/store';
// import TitulosJerarquia from './TitulosJerarquia/TitulosJerarquia';

// interface GestionLayoutProps {
//   children?: React.ReactNode;
// }

// const GestionLayoutHojaPresupuesto: React.FC<GestionLayoutProps> = () => {

//   const {activePresupuesto} = useSelector((state: RootState) => state.activeData);

//   useEffect(() => {
//     return () => {
//       clearActiveProyecto();
//       clearActivePresupuesto();
//       clearActiveComposicionApu();
//     }
//   }, []);

//   return (
//     <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row bg-gray-900/50 overflow-hidden">
//       {/* Panel izquierdo - Lista de Presupuestos */}
//       <div className="w-full md:w-1/4 h-1/2 md:h-full md:min-w-[250px] md:max-w-md border-b md:border-b-0 md:border-r border-gray-700 overflow-y-auto">
//         <ListaProyectos />
//       </div>

//       {/* Panel derecho - Contenedor flexible para formulario y área inferior */}
//       { activePresupuesto && <div className="flex-1 flex flex-col h-1/2 md:h-full">
//         {/* Panel superior derecho - Formulario de Proyecto */}
//         <div className="h-full border-b border-gray-700 overflow-y-auto">
//           <div className="p-0.5 md:p-2">
//             <TitulosJerarquia />
//           </div>
//         </div>

//         {/* Panel inferior derecho - Área para componente futuro */}
//         {/* <div className="h-1/2 border-b border-gray-700 overflow-y-auto"> */}
          
//         {/* </div> */}
//       </div>}
//     </div>
//   );
// };

// export default GestionLayoutHojaPresupuesto;