import React, { useState } from 'react';
import Button from '../../components/Buttons/Button';
import Modal from '../../components/Modal/Modal';

const CalendarPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Section A: Titles */}
      <header className="bg-white p-2 shadow-md rounded-xl h-16">
        <nav className="flex items-center space-x-4">
          <a href="#" className="text-gray-600">Mi calendario</a>
          <a href="#" className="text-blue-600 font-medium">Calendario de la compañía</a>
          <a href="#" className="text-gray-600">Disponibilidad de la sala de reuniones</a>
          <div className="flex-grow"></div>
          <button className="text-gray-600">Más</button>
        </nav>
      </header>

      {/* Section B: Subtitles */}
      <div className="x text-white p-4 flex items-center justify-between">
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
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl">
        {/* Section C: Tables */}
        <main className="w-full flex flex-col flex-grow p-4 bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Actividades Septiembre, 2024</h2>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Programar</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">&lt; Hoy &gt;</button>
            </div>
          </div>
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              <table className="w-full bg-white shadow-md">
                <thead className="bg-gray-200 text-gray-700 sticky top-0 z-20">
                  <tr>
                    {[...Array(20)].map((_, index) => (
                      <th key={index} className={`py-3 px-4 font-semibold text-sm text-left whitespace-nowrap ${index === 0 ? 'sticky left-0 z-30' : ''}`}>
                        {index === 0 ? (
                          <div className="sticky left-0 bg-gray-200">Columna {index + 1}</div>
                        ) : (
                          `Columna ${index + 1}`
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(20)].map((_, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}
                    >
                      {[...Array(20)].map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className={`py-2 px-4 border-b border-gray-200 ${colIndex === 0 ? 'sticky left-0 z-10' : ''}`}
                        >
                          {colIndex === 0 ? (
                            <div className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                              Fila {rowIndex + 1}, Col {colIndex + 1}
                            </div>
                          ) : (
                            `Fila ${rowIndex + 1}, Col ${colIndex + 1}`
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
          {/* Mini calendar would go here */}
          <div className="flex-grow border rounded-lg overflow-hidden">
            <div className="h-full overflow-auto">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="p-2 border-b hover:bg-gray-200 transition-colors">
                  SubActividad {index + 1}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalendarPage;