import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const Recursos: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const generateTableData = (n: number, m: number) => {
    const headers = Array(n).fill(null).map((_, index) => `Columna ${index + 1}`);
    const rows = Array(m).fill(null).map((_, rowIndex) => {
      const row: Record<string, any> = {};
      headers.forEach((header, colIndex) => {
        row[header] = `Fila ${rowIndex + 1}, Col ${colIndex + 1}`;
      });
      return row;
    });
  
    return { headers, rows };
  };
  
  const tableData = generateTableData(30, 1000);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Section A: Titles */}
      <motion.header 
        className="bg-white p-2 shadow-md rounded-xl h-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <nav className="flex items-center space-x-4">
          <a href="#" className="text-gray-600">Mi calendario</a>
          <a href="#" className="text-blue-600 font-medium">Calendario de la compañía</a>
          <a href="#" className="text-gray-600">Disponibilidad de la sala de reuniones</a>
          <div className="flex-grow"></div>
          <button className="text-gray-600">Más</button>
        </nav>
      </motion.header>

      {/* Section B: Subtitles */}
      <motion.div 
        className="x text-white p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-2xl font-bold">Calendario ☼</h1>
        <div className="flex space-x-2">
          <Button onClick={handleButtonClick} text='Terminar' />
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Permisos de Modal">
            <p> Soy un Modal</p>
          </Modal>
          <div className="relative">
            <input type="text" placeholder="Filtrar y buscar" className="bg-white/10 text-white/80 hover:bg-white hover:text-black active:bg-red-500 px-4 py-2 rounded" />
            <span className="absolute right-3 top-2">🔍</span>
          </div>
          <Button color='transp' text='Calendarios' />
          <Button color='transp' text='⚙️' />
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-1 overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Section C: Tables */}
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Actividades Septiembres, 2024</h2>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Programar</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">&lt; Hoy &gt;</button>
            </div>
          </div>
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              <TableComponent tableData={tableData} />
            </div>
          </div>
        </main>

        {/* Section D: Samples */}
        <aside className="w-64 flex flex-col p-4 bg-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors w-full">
              &lt; Editar actividad &gt;
            </button>
          </div>
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              {[...Array(10)].map((_, index) => (
                <motion.div 
                  key={index} 
                  className="p-2 border-b hover:bg-gray-200 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  SubActividad {index + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
};

export default Recursos;