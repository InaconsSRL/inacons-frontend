import React, { useState } from 'react';
import TransfersPage from '../../Tranferencias/TransfersPage';
import AlmacenBetha from './AlmacenBetha';

export const AlmacenBoardPage: React.FC = () => {

  // Estados principales
  const [mostrarTransfersPage, setMostrarTransfersPage] = useState(false)

  return (
    <div className="container mx-auto px-6">

      <div className="flex justify-between gap-4 items-end mb-6">
      <div className="text-white pb-4">
        <h1 className="text-2xl font-bold">Sistema de Kardex Empresarial</h1>
      </div>
      <div className='flex gap-4'>
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded"
          onClick={() => setMostrarTransfersPage(!mostrarTransfersPage)}
        >
          {!mostrarTransfersPage? "Mostrar Transeferencias" : "Mostrar Inventario"}
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Exportar
        </button>
      </div>
      </div>

      {/* Todo esto es la tabla */}

      {mostrarTransfersPage ? (<TransfersPage />) : 
      ( <AlmacenBetha />)
      }      
    </div>
  );
};

export default AlmacenBoardPage;