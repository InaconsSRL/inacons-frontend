import React, { useState, useEffect, useMemo } from 'react';
import { RequerimientoForm } from './RequerimientoForm';
import { ProductList } from './ProductList';
import { SelectedProducts } from './SelectedProducts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
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
  const [isLoading, setIsLoading] = useState(true);
  const [guardado, setGuardado] = useState(false);

  const emptyInitialValues: InitialValues = {
    codigo: "",
    estado_atencion: "",
    fecha_final: "",
    fecha_solicitud: "",
    id: "",
    obra_id: "",
    presupuesto_id: null,
    sustento: "",
    usuario: "",
    usuario_id: ""
  };

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

  useEffect(() => {
    if (guardado) {
      setRequerimiento_id(null);
      setRequerimientoData(emptyInitialValues);
      setGuardado(false);
    }
  }, [guardado]);

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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 relative min-h-[calc(90vh)] ">
        <div className='col-span-4'>
          <RequerimientoHeader 
            key={requerimiento_id}
            requerimiento={requerimientoData!} 
            obras={obras}
            setGuardado={setGuardado}
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