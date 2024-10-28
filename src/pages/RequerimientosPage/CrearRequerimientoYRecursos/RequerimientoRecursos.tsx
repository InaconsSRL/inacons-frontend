import React, { useState } from 'react';
import { RequerimientoForm } from './RequerimientoForm';
import { ProductList } from './ProductList';
import { SelectedProducts } from './SelectedProducts';

const ProductsPage: React.FC = () => {
  const [requerimiento_id, setRequerimiento_id] = useState<string | null>(null);

  const handleRequerimientoCreated = (id: string) => {
    setRequerimiento_id(id);
  };

  return (
    <div className="container mx-auto py-8">
      {!requerimiento_id ? (
        <RequerimientoForm onRequerimientoCreated={handleRequerimientoCreated} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <ProductList requerimiento_id={requerimiento_id} />
          </div>
          <div>
            <SelectedProducts requerimiento_id={requerimiento_id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;