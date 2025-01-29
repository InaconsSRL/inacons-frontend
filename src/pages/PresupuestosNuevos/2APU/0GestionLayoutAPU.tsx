import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import ListaProyectos from './ListaProyectos';
import { clearActiveTitulo, clearActivePresupuesto, clearActiveProyecto } from '../../../slices/activeDataSlice';
import PresupuestoTableAPU from './PresupuestoTableAPU';
import APU from './APU';
import LoaderOverlay from '../../../components/Loader/LoaderOverlay';
import { getComposicionesApuByTitulo } from '../../../slices/composicionApuSlice';
import { fetchTipos } from '../../../slices/tipoSlice';

interface GestionLayoutProps {
  children?: React.ReactNode;
}

const GestionLayoutAPU: React.FC<GestionLayoutProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeProyecto, activePresupuesto, activeTitulo } = useSelector((state: RootState) => state.activeData);
  const loading = useSelector((state: RootState) => state.titulo.loading);
  const composiciones = useSelector((state: RootState) => state.composicionApu.composicionesApu);
  const tipos = useSelector((state: RootState) => state.tipo.tipos);
  const composicionesLoading = useSelector((state: RootState) => state.composicionApu.loading);

  useEffect(() => {
    if (activeTitulo?.id_titulo && activeProyecto?.id_proyecto) {
      dispatch(getComposicionesApuByTitulo({
        id_titulo: activeTitulo.id_titulo,
        id_proyecto: activeProyecto.id_proyecto
      }));
      if (tipos.length === 0) {
        dispatch(fetchTipos());
      }
    }
  }, [activeTitulo, dispatch]);

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

        {/* Panel inferior derecho - Área para APU o LoaderOverlay */}
        {activeTitulo && (
          <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
            {loading || composicionesLoading ? (
              <LoaderOverlay message="Cargando composiciones..." />
            ) : (
              <APU composiciones={composiciones} />
            )}
          </div>
        )}
      </div>}
    </div>
  );
};

export default GestionLayoutAPU;