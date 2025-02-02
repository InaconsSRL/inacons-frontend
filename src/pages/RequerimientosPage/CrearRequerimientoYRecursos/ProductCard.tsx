import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { addRequerimientoRecurso } from '../../../slices/requerimientoRecursoSlice';
import { Recurso } from './types/interfaces';
import defaultImage from '../../../assets/NoImage.webp';

interface ProductCardProps extends Recurso {
  viewType: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  codigo,
  nombre,
  imagenes,
  requerimiento_id,
  fecha_limit,
  unidad_id,
  viewType
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [notas, setNotas] = useState('');

  const unidades = useSelector((state: RootState) => state.unidad.unidades);
  console.log(nombre)

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
    <>
    { viewType === 'grid' ? ( 
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
        <h3 className="text-[14px] font-medium">{nombre}</h3>
        <p className="text-gray-500 text-[12px]">Códigos: {codigo}</p>
        <p className="text-gray-500 text-[12px]">Unidad: {unidades.find(u => u.id === unidad_id)?.nombre || 'No especificada'}</p>


        <div className="flex items-center justify-between mt-4">
          <div className='flex flex-col'>

            <label className='text-[14px]' htmlFor={`cantidad-${id}`}>Cantidad:</label>
            <input
              id={`cantidad-${id}`}
              name='cantidad'
              type="number"
              min="0"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
              className="w-8 pl-2 border rounded-md text-[15px] bg-slate-700 text-white min-w-10"
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

            <label className='text-[14px]' htmlFor={`notas-${id}`}>Ingrese notas:</label>
            <input
              id={`notas-${id}`}
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value || "")}
              className="w-full border pl-2 h-7 rounded-md text-[10px] bg-slate-800 text-white "
            />
          </div>
        </div>
      </div>
    </div>
        ) : (
        <div className="bg-white/85 shadow-md rounded-lg ">
          <div className="flex p-2">
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={imageUrl}
                alt={nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultImage;
                }}
              />
            </div>
            <div className="flex-1 ml-2">
              <h3 className="text-sm font-medium">{nombre}</h3>
              <p className="text-xs text-gray-500">Códigos: {codigo}</p>
              <p className="text-xs text-gray-500">
                Unidad: {unidades.find(u => u.id === unidad_id)?.nombre || 'No especificada'}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <label className="text-sm" htmlFor={`cantidad-list-${id}`}>
                    Cantidad:
                  </label>
                  <input
                    id={`cantidad-list-${id}`}
                    name="cantidad"
                    type="number"
                    min="0"
                    value={selectedQuantity}
                    onChange={e => setSelectedQuantity(parseInt(e.target.value) || 0)}
                    className="w-16 pl-2 border rounded-md text-sm bg-slate-700 text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="sr-only" htmlFor={`notas-list-${id}`}>
                    Notas:
                  </label>
                  <input
                    id={`notas-list-${id}`}
                    type="text"
                    placeholder="Notas"
                    value={notas}
                    onChange={e => setNotas(e.target.value || "")}
                    className="w-full border pl-2 h-7 rounded-md text-xs bg-slate-800 text-white"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};