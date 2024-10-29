import React, { useState, useEffect } from 'react';
import { RequerimientoForm } from './RequerimientoForm';
import { ProductList } from './ProductList';
import { SelectedProducts } from './SelectedProducts';

interface RequerimientoRecursosProps {
  initialValues: any; // Ajusta el tipo según sea necesario
}

const RequerimientoRecursos: React.FC<RequerimientoRecursosProps> = ({ initialValues }) => {
  const [requerimiento_id, setRequerimiento_id] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setRequerimiento_id(initialValues.id);
    }
  }, [initialValues]);

  const handleRequerimientoCreated = (id: string) => {
    setRequerimiento_id(id);
  };

  return (
    <div className="container mx-auto py-8">
      {!requerimiento_id ? (
        <RequerimientoForm onRequerimientoCreated={handleRequerimientoCreated} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative min-h-[calc(100vh-4rem)]">
          <div className="col-span-2 h-full">
            <ProductList requerimiento_id={requerimiento_id} />
          </div>
          <div className="lg:sticky lg:top-8">
            <SelectedProducts requerimiento_id={requerimiento_id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequerimientoRecursos;