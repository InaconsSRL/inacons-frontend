import React from 'react';
import { motion } from 'framer-motion';
import check from '../../assets/SVG/check.webp'
import transport from '../../assets/SVG/transporte.webp'
import empresa from '../../assets/SVG/empresa.webp'

interface CardProps {
  title: string;
  children: React.ReactNode;
  buttonText: string;
  isActive: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, buttonText, isActive }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 w-80 h-[280px] flex flex-col justify-between transition-all duration-300 ${isActive ? 'border-2 border-blue-500 transform scale-105' : ''
    }`}>
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
    <button className={`w-full py-3 rounded-md transition-colors text-white font-medium ${isActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
      }`}>
      {buttonText}
    </button>
  </div>
);

const StatusBadge: React.FC<{ status: string; isActive: boolean }> = ({ status, isActive }) => (
  <span className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
    {status}
  </span>
);

const ShipmentTracker: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-210px)] bg-gradient-to-b from-slate-300 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-center font-montserrat font-normal text-[3vh] mb-16 bg-blue-800/45 rounded-lg">SEGUIMIENTO DE ENVIO</h2>

        {/* Simplified Progress Bar (from Algo.tsx) */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-between w-full max-w-4xl mx-auto mb-16">

          {/* Origin */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <div className="w-36 h-36 bg-green-500 rounded-full flex items-center justify-center">
                <img className='mx-auto' src={check} alt="check" />
              </div>
            </div>
            <span className="text-gray-700 font-medium">Origen</span>
          </div>

          {/* Connecting Line 1 */}
          <div className="flex-1 h-1 bg-gray-50 relative mx-4">
            <div className="absolute w-full h-full bg-blue-500 transform -translate-y-0 rounded-xl"></div>
          </div>

          {/* In Transit */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <div className="w-36 h-36 bg-sky-200 rounded-full flex items-center justify-center">
                <img src={transport} alt="check" />
              </div>
            </div>
            <span className="text-gray-700 font-medium">En Tránsito</span>
          </div>

          {/* Connecting Line 2 */}
          <div className="flex-1 h-1 bg-gray-50 relative mx-4">
            <div className="absolute w-1/2 h-full bg-blue-500 transform -translate-y-0 rounded-xl"></div>
          </div>

          {/* Final Destination */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <div className="w-36 h-36 bg-blue-100 rounded-full flex items-center justify-center">
                <img src={empresa} alt="check" />
              </div>
            </div>
            <span className="text-gray-700 font-medium">Destino</span>
          </div>

        </motion.div>

        {/* Existing detailed tracking cards */}
        <div className="relative flex justify-between mb-20">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10" />
          <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-blue-500 -z-10" />

          <div className="flex-1 flex justify-between relative">
            {/* Origin */}
            <div className="flex flex-col items-center">

              <Card title="Origen" buttonText="Detalles de Origen" isActive={true}>
                <div className="space-y-4">
                  <div>
                    <StatusBadge status="Completado" isActive={true} />
                    <div className="mt-3">
                      <p className="text-lg font-medium text-gray-800">Almacén Principal</p>
                      <p className="text-gray-600">Código: 2166F3</p>
                      <p className="text-gray-600">Unidades: 21.8</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* In Transit */}
            <div className="flex flex-col items-center">

              <Card title="En Tránsito" buttonText="Rastrear Envío" isActive={true}>
                <div className="space-y-4">
                  <div>
                    <StatusBadge status="En Proceso" isActive={true} />
                    <div className="mt-3">
                      <p className="text-lg font-medium text-gray-800">Transportista Asignado</p>
                      <p className="text-gray-600">Ruta: R-2767</p>
                      <p className="text-gray-600">Tiempo Est.: 30 min</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Destination */}
            <div className="flex flex-col items-center">

              <Card title="Destino" buttonText="Ver Destino" isActive={false}>
                <div className="space-y-4">
                  <div>
                    <StatusBadge status="Pendiente" isActive={false} />
                    <div className="mt-3">
                      <p className="text-lg font-medium text-gray-800">Centro de Distribución</p>
                      <p className="text-gray-600">Código: 2296V</p>
                      <p className="text-gray-600">Llegada Est.: 11:30</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;