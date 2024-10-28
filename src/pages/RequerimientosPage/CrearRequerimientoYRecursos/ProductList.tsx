import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchRecursos } from '../../../slices/recursoSlice';
import { fetchObras } from '../../../slices/obrasSlice';
import { ProductCard } from './ProductCard';
import LoaderPage from '../../../components/Loader/LoaderPage';
import { ProductListProps } from './types/interfaces';

export const ProductList: React.FC<ProductListProps> = ({ requerimiento_id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { recursos, loading: loadingRecursos } = useSelector((state: RootState) => state.recurso);
  const { obras, loading: loadingObras } = useSelector((state: RootState) => state.obra);

  useEffect(() => {
    if (recursos.length === 0) dispatch(fetchRecursos());
    if (obras.length === 0) dispatch(fetchObras());
  }, [dispatch]);

  if (loadingRecursos || loadingObras) {
    return <LoaderPage />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recursos.map((recurso) => (
        <ProductCard key={recurso.id} {...recurso} requerimiento_id={requerimiento_id} />
      ))}
    </div>
  );
};