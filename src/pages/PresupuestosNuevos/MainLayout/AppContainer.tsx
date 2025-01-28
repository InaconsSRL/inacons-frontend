import React, {  } from 'react';
// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../../store/store';
// import ProyectoSelector from './ProyectoSelector';
// import NuevoProyectoForm from './ProyectoForm';
// import { clearActiveProyecto, setActiveProyecto } from '../../slices/activeDataSlice';
// import { IProyecto } from '../../types/gestionTypes';
import GestionLayout from '../DatosGenerales/GestionLayoutDatosGenerales';

const AppContainer: React.FC = () => {
  console.log("AppContainer")
  // const dispatch = useDispatch();
  // const [currentView, setCurrentView] = useState<'selector' | 'nuevo' | 'main' | 'editar'>('selector');
  // const activeProyecto = useSelector((state: RootState) => state.activeData.activeProyecto);
  // console.log(activeProyecto);

  // // const handleLogout = () => {
  // //   dispatch(clearActiveProyecto());
  // //   setCurrentView('selector');
  // // };

  // const handleEditProyecto = (proyecto: IProyecto) => {
  //   dispatch(setActiveProyecto(proyecto));
  //   setCurrentView('editar');
  // };

  // const handleEditCancel = () => {
  //   dispatch(clearActiveProyecto()); // Limpia el proyecto activo
  //   setCurrentView('selector'); // Vuelve al selector
  // };

  // // Determinar la vista basada en el estado actual y el proyecto activo
  // if (!activeProyecto) {
  //   if (currentView === 'nuevo') {
  //     return (
  //       <NuevoProyectoForm
  //         onCancel={() => setCurrentView('selector')}
  //         onSuccess={() => setCurrentView('main')}
  //       />
  //     );
  //   }
  //   return (
  //     <ProyectoSelector
  //       onCreateNew={() => setCurrentView('nuevo')}
  //       onEdit={handleEditProyecto}
  //     />
  //   );
  // }

  // if (currentView === 'editar' && activeProyecto) {
  //   return (
  //     <NuevoProyectoForm
  //       onCancel={handleEditCancel} // Usamos el nuevo manejador
  //       onSuccess={() => setCurrentView('main')}
  //       editMode={true}
  //       initialData={activeProyecto}
  //     />
  //   );
  // }

  return (
    // <MainLayout
    //   proyecto={activeProyecto}
    //   onLogout={handleLogout}
    //   />
    <GestionLayout />
  );
};

export default AppContainer;