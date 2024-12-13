import React from 'react';

interface LoaderProgressProps {
  current: number;
  total: number;
}

const LoaderProgress: React.FC<LoaderProgressProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;
  const isCalculating = isNaN(percentage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <div className="flex flex-col items-center">
          <div className="relative">
            {isCalculating ? (
              // Icono de carga mientras se calcula
              <svg 
                className="w-20 h-20 animate-spin text-blue-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500 transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (percentage * 264) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-semibold">
                {isCalculating ? (
                  <span className="text-blue-500">...</span>
                ) : (
                  `${Math.round(percentage)}%`
                )}
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {isCalculating ? 'Preparando recursos...' : 'Guardando recursos'}
            </p>
            <p className="text-sm text-gray-500">
              {isCalculating ? (
                'Iniciando proceso'
              ) : (
                `${current} de ${total} recursos`
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderProgress;
