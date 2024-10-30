import React, { useState, useEffect, useMemo } from 'react';
import { RequerimientoForm } from './RequerimientoForm';
import { ProductList } from './ProductList';
import { SelectedProducts } from './SelectedProducts';
import RequerimientoHeader from './RequerimientoHeader';
import LoaderPage from '../../../components/Loader/LoaderPage';

interface InitialValues {
  codigo: string;
  estado_atencion: string;
  fecha_final: string;
  fecha_solicitud: string;
  id: string;
  obra_id: string;
  presupuesto_id: string | null;
  sustento: string;
  usuario: string;
  usuario_id: string;
}

interface RequerimientoRecursosProps {
  initialValues?: InitialValues;
}

const RequerimientoRecursos: React.FC<RequerimientoRecursosProps> = ({ initialValues }) => {
  const [requerimiento_id, setRequerimiento_id] = useState<string | null>(null);
  const [requerimientoData, setRequerimientoData] = useState<InitialValues | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Agregar estado de loading
  
  const memoizedInitialId = useMemo(() => initialValues?.id, [initialValues]);

  useEffect(() => {
    setIsLoading(true); // Iniciar loading
    
    if (memoizedInitialId && !requerimiento_id && initialValues) {
      setRequerimiento_id(memoizedInitialId);
      setRequerimientoData(initialValues);
    }
    
    // Usar setTimeout para simular el tiempo mínimo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 300ms de tiempo mínimo de carga

    return () => clearTimeout(timer);
  }, [memoizedInitialId, requerimiento_id, initialValues]);

  // Mostrar LoaderPage mientras está cargando
  if (isLoading) {
    return <LoaderPage />;
  }

  const handleRequerimientoCreated = (id: string, data: InitialValues) => {
    setRequerimiento_id(id);
    setRequerimientoData(data);
  };

  const renderContent = () => {
    if (!requerimiento_id) {
      return <RequerimientoForm onRequerimientoCreated={handleRequerimientoCreated} />;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 relative min-h-[calc(100vh-4rem)] ">
        <div className='col-span-3'>
        <RequerimientoHeader 
          key={requerimiento_id} // Agregar key para forzar remontaje cuando cambie el ID
          requerimiento={requerimientoData!} 
        />
        </div>
        <div className="col-span-2 h-full ">
          <ProductList requerimiento_id={requerimiento_id} fecha_final={requerimientoData ? new Date(requerimientoData.fecha_final) : new Date()} />
        </div>
        <div className="lg:sticky lg:top-8">
          <SelectedProducts requerimiento_id={requerimiento_id} />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      {renderContent()}
    </div>
  );
};

export default RequerimientoRecursos;