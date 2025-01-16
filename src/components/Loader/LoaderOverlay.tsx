import React from 'react';
import ReactDOM from 'react-dom';

interface LoaderOverlayProps {
  message?: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ message = 'Procesando...' }) => {
  // Crear el contenedor para loaders si no existe
  React.useEffect(() => {
    if (!document.getElementById('loader-root')) {
      const loaderRoot = document.createElement('div');
      loaderRoot.id = 'loader-root';
      document.body.appendChild(loaderRoot);
    }
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[99999] flex items-center justify-center">
      <div className="bg-gradient-to-b from-white/20 to-white/5 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl border border-white/10 backdrop-blur-md">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 p-[3px] shadow-lg shadow-blue-500/50">
            <div className="w-full h-full rounded-full bg-slate-900/80 flex items-center justify-center p-2">
              <div className="w-full h-full border-4 border-t-blue-400 border-r-blue-400/40 border-b-blue-400/10 border-l-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <p className="text-white font-medium text-lg tracking-wide drop-shadow-md">{message}</p>
      </div>
    </div>,
    document.getElementById('loader-root') || document.body
  );
};

export default LoaderOverlay;
