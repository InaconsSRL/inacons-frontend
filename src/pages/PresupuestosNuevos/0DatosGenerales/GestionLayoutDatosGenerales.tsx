import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import ListaProyectos from './ListaProyectos';
import ProyectoForm from './ProyectoForm';
import ListaPresupuestos from './ListaPresupuestos';
import { clearActiveComposicionApu, clearActivePresupuesto, clearActiveProyecto } from '../../../slices/activeDataSlice';

interface GestionLayoutProps {
  children?: React.ReactNode;
}

const GestionLayoutDatosGenerales: React.FC<GestionLayoutProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeProyecto = useSelector((state: RootState) => state.activeData.activeProyecto);

  useEffect(() => {
    return () => {
      dispatch(clearActiveProyecto());
      dispatch(clearActivePresupuesto());
      dispatch(clearActiveComposicionApu());
    }
  }, [dispatch]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row bg-gray-900/50 overflow-hidden">
      {/* Panel izquierdo - Lista de Presupuestos */}
      <div className="w-full lg:w-1/4 h-[40vh] lg:h-full lg:min-w-[300px] lg:max-w-md border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto">
        <ListaProyectos />
      </div>

      {/* Panel derecho - Contenedor flexible para formulario y área inferior */}
      <div className="flex-1 flex flex-col h-[60vh] lg:h-full">
        {/* Panel superior derecho - Formulario de Proyecto */}
        <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
          <div className="p-2 lg:p-4">
            <ProyectoForm
              editMode={!!activeProyecto}
              initialData={activeProyecto || undefined}
            />
          </div>
        </div>

        {/* Panel inferior derecho - Área para componente futuro */}
        {activeProyecto && <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
          <div className="p-2 lg:p-4">
            <ListaPresupuestos id_proyecto={activeProyecto?.id_proyecto || ''} />


          </div>
        </div>}
      </div>
    </div>
  );
};

export default GestionLayoutDatosGenerales;