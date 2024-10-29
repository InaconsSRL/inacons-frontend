import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { addRequerimientoRecurso } from '../../../slices/requerimientoRecursoSlice';
import { Recurso } from './types/interfaces';

const defaultImage = "https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg";

export const ProductCard: React.FC<Recurso> = ({
  id,
  codigo,
  nombre,
  imagenes,
  requerimiento_id,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  const handleAddToCart = () => {
    dispatch(addRequerimientoRecurso({ 
      requerimiento_id: requerimiento_id,
      recurso_id: id, 
      cantidad: selectedQuantity,
      cantidad_aprobada: 0,
    }));
  };

  const imageUrl = imagenes?.length > 0 ? imagenes[0].file : defaultImage;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={nombre} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-[8px] font-medium">{nombre}</h3>
        <p className="text-gray-500 text-[8px]">Códigos: {codigo}</p>        
        <div className="flex items-center justify-between mt-4">
          <input
            type="number"
            min="0"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
            className="w-16 p-2 border rounded-md"
          />
          <button 
              onClick={handleAddToCart} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Agregar
            </button>        
            
        </div>
      </div>
    </div>
  );
};