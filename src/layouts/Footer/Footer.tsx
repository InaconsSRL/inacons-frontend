import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-lg py-4">
      <div className="container mx-auto px-4 flex justify-between items-center text-white text-sm">
        {/* Sección izquierda: Información de derechos reservados */}
        <div className="flex items-center space-x-4">
          <span>© 2024 Bitrix24</span>
          <span>|</span>
          <span>Español</span>
        </div>

        {/* Sección central: Enlaces */}
        <div className="flex items-center space-x-4">
          <a href="#contact" className="hover:text-gray-300 transition-colors">Persona de contacto</a>
          <a href="#topics" className="hover:text-gray-300 transition-colors">Temas</a>
          <a href="#print" className="hover:text-gray-300 transition-colors">Impresión</a>
        </div>

        {/* Sección derecha: Enlace adicional */}
        <div>
          <a href="https://nufago.bitrix24.es/company/personal/user/793/calendar/" className="hover:text-gray-300 transition-colors">
            https://nufago.bitrix24.es/company/personal/user/793/calendar/
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
