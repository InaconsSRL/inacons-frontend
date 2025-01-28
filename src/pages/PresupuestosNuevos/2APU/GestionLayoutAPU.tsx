import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import ListaProyectos from './ListaProyectos';
import { clearActiveTitulo, clearActivePresupuesto, clearActiveProyecto } from '../../../slices/activeDataSlice';
import PresupuestoTableAPU from './PresupuestoTableAPU';
import APU from './APU';

interface GestionLayoutProps {
  children?: React.ReactNode;
}

const GestionLayoutAPU: React.FC<GestionLayoutProps> = () => {
  const dispatch = useDispatch();
  const { activeProyecto, activePresupuesto, activeTitulo } = useSelector((state: RootState) => state.activeData);

  useEffect(() => {
    return () => {
      dispatch(clearActiveProyecto());
      dispatch(clearActivePresupuesto());
      dispatch(clearActiveTitulo());
    }
  }, [dispatch]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row bg-gray-900/50 overflow-hidden">
      {/* Panel izquierdo - Lista de Presupuestos */}
      <div className="w-full lg:w-1/4 h-[40vh] lg:h-full lg:min-w-[300px] lg:max-w-md border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto">
        <ListaProyectos />
      </div>

      {/* Panel derecho - Contenedor flexible para formulario y área inferior */}
      {activeProyecto && <div className="flex-1 flex flex-col h-[60vh] lg:h-full">
        {/* Panel superior derecho - Formulario de Proyecto */}
        {activePresupuesto && <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
          <PresupuestoTableAPU />
        </div>}

        {/* Panel inferior derecho - Área para componente futuro */}
        {activeTitulo && <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
          <APU />
        </div>}
      </div>}
    </div>
  );
};

export default GestionLayoutAPU;