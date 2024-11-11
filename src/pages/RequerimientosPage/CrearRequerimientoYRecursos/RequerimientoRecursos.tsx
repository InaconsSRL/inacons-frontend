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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 relative min-h-[calc(90vh)] min-w-[70vw] ">
        <div className='col-span-4'>
          <RequerimientoHeader 
            key={requerimiento_id}
            requerimiento={requerimientoData!} 
            obras={obras}
            onClose={onClose}
          />
        </div>
        <div className="col-span-2 h-full ">
          <ProductList requerimiento_id={requerimiento_id} fecha_final={requerimientoData ? new Date(requerimientoData.fecha_final) : new Date()} />
        </div>
        <div className="col-span-2 lg:sticky lg:top-8">
          <SelectedProducts requerimiento_id={requerimiento_id} fecha_final={requerimientoData ? new Date(requerimientoData.fecha_final) : new Date()} />
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