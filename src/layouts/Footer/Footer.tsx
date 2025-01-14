import React from 'react';
const Footer: React.FC = () => {




  return (
    <footer className="hidden lg:flex fixed bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-lg py-4">
      <div className="container mx-auto px-4 flex justify-between items-center text-white text-[8px] sm:text-sm">
        {/* Sección izquierda: Información de derechos reservados */}
        <div className="flex items-center space-x-4">
          <span>© 14012025 NUFAGO</span>
          <span>|</span>
          <span>Español</span>
        </div>

        {/* Sección central: Enlaces */}
        <div className="flex items-center space-x-4">
          <a href="#contact" className="hover:text-gray-300 transition-colors">Contacto</a>
          <a href="#topics" className="hover:text-gray-300 transition-colors">Documentación</a>
          <a href="#print" className="hidden md:block hover:text-gray-300 transition-colors">Nuestra Web</a>
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;
