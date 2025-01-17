import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { RequerimientoForm } from './RequerimientoForm';
import { ProductList } from './ProductList';
import { SelectedProducts } from './SelectedProducts';
import RequerimientoHeader from './RequerimientoHeader/RequerimientoHeader';
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
  onClose: () => void;
}

const RequerimientoRecursos: React.FC<RequerimientoRecursosProps> = ({ initialValues, onClose }) => {
  const [requerimiento_id, setRequerimiento_id] = useState<string | null>(null);
  const [requerimientoData, setRequerimientoData] = useState<InitialValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoizedInitialId = useMemo(() => initialValues?.id, [initialValues]);
  const obras = useSelector((state: RootState) => state.obra);

  useEffect(() => {
    setIsLoading(true);
    
    if (memoizedInitialId && !requerimiento_id && initialValues) {
      setRequerimiento_id(memoizedInitialId);
      setRequerimientoData(initialValues);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [memoizedInitialId, requerimiento_id, initialValues]);

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
      <div className="flex flex-col gap-4 min-h-[calc(85vh)] min-w-[70vw] p-4">
        <div className='w-full h-28'>
          <RequerimientoHeader 
            key={requerimiento_id}
            requerimiento={requerimientoData!} 
            obras={obras}
            onClose={onClose}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-20rem)]">
          <div className="overflow-auto rounded-lg shadow-md bg-white/50 p-4">
            <ProductList 
              requerimiento_id={requerimiento_id} 
              fecha_final={requerimientoData ? new Date(requerimientoData.fecha_final) : new Date()} 
            />
          </div>
          <div className="overflow-auto rounded-lg shadow-md bg-white/50 p-4">
            <SelectedProducts 
              requerimiento_id={requerimiento_id} 
              fecha_final={requerimientoData ? new Date(requerimientoData.fecha_final) : new Date()} 
            />
          </div>
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