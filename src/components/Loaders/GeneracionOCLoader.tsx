
import React from 'react';
import { motion } from 'framer-motion';

interface GeneracionOCLoaderProps {
  step: number;
  progress: number;
}

const GeneracionOCLoader: React.FC<GeneracionOCLoaderProps> = ({ step, progress }) => {
  const steps = [
    'Iniciando generación de OC',
    'Creando orden de compra',
    'Asociando recursos',
    'Finalizando proceso'
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <motion.div 
        className="h-2 bg-blue-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <div className="mt-6">
        {steps.map((texto, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 mb-3 ${index === step ? 'text-blue-600' : 'text-white'}`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: index <= step ? 1 : 0.5 
            }}
            transition={{ delay: index * 0.2 }}
          >
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                ${index < step ? 'bg-green-500' : index === step ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              {index < step ? '✓' : (index + 1)}
            </motion.div>
            <span>{texto}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GeneracionOCLoader;