import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { addRequerimientoRecurso } from '../../../slices/requerimientoRecursoSlice';
import { Recurso } from './types/interfaces';
import defaultImage from '../../../assets/NoImage.webp';

export const ProductCard: React.FC<Recurso> = ({
  id,
  codigo,
  nombre,
  imagenes,
  requerimiento_id,
  fecha_limit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [notas, setNotas] = useState('');

  const handleAddToCart = () => {
    dispatch(addRequerimientoRecurso({
      requerimiento_id: requerimiento_id,
      recurso_id: id,
      cantidad: selectedQuantity,
      notas: notas,
      cantidad_aprobada: 0,
      fecha_limit: fecha_limit,
    }));
  };

  const imageUrl = imagenes?.length > 0 ? imagenes[0].file : defaultImage;

  return (
    <div className="bg-white/85 shadow-md rounded-lg overflow-hidden">
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
          <div className='flex flex-col'>

            <label className='text-[8px] ' htmlFor="cantidad">Cantidad:</label>
            <input
              name='cantidad'
              type="number"
              min="0"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
              className="w-8 pl-2 border rounded-md text-[10px] bg-slate-700 text-white min-w-10"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-md ml-2 text-[10px] py-1.5"
          >
            Agregar
          </button>
        </div>
        <div className="mt-0">
          <div className='flex flex-col'>

            <label className='text-[8px] ' htmlFor="cantidad">Ingrese notas:</label>
            <input
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value || "")}
              className="w-full border pl-2 rounded-md text-[10px] bg-slate-800 text-white "
            />
          </div>
        </div>
      </div>
    </div>
  );
};