import React, { useState, ChangeEvent } from 'react';
import Card from '../../components/Card/Card';
import { FaBriefcase, FaGraduationCap, FaBuilding } from 'react-icons/fa'; // Usando react-icons que sí está en package.json

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  experiencia: string;
  educacion: string;
  mensaje: string;
}

const CareerPage = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    experiencia: '',
    educacion: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-zinc-300 relative overflow-hidden">
      {/* Olas decorativas */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <svg className="absolute top-0 left-0 w-full filter drop-shadow-lg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(59, 130, 246, 0.8)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"></path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full filter drop-shadow-lg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(59, 130, 246, 0.8)" d="M0,64L48,96C96,128,192,192,288,192C384,192,480,128,576,128C672,128,768,192,864,192C960,192,1056,128,1152,106.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" filter="drop-shadow(0 -4px 6px rgba(0, 0, 0, 0.1))"></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section con imagen */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Únete a Nuestro Equipo
          </h1>
            <p className="text-xl text-white drop-shadow-lg">
            Construyendo el futuro juntos
            </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <img 
              src="https://www.descripciondepuestos.org/wp-content/uploads/2024/09/e8t7305HJ7kzU_1C4I_iV.png.webp" 
              alt="Ingeniero" 
              className="rounded-lg shadow-xl object-cover w-full h-[300px]" 
            />
            <img 
              src="https://ucal.edu.pe/blog/sites/default/files/inline-images/requisitos-para-convertirse-en-arquitecto2.jpg" 
              alt="Arquitecto" 
              className="rounded-lg shadow-xl object-cover w-full h-[300px]" 
            />
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFEU_U0JF4P3V9PrmxroXVeDBjWfThVlPiICyp1w8V0dSGE806SsFvUsfiqIk30-2ppu0&usqp=CAU" 
              alt="Constructor" 
              className="rounded-lg shadow-xl object-cover w-full h-[300px]" 
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/90 backdrop-blur-sm p-6 hover:shadow-xl transition-shadow border border-blue-200">
            <FaBuilding className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Proyectos Innovadores</h3>
            <p className="text-blue-700">Trabaja en proyectos que transforman ciudades y comunidades.</p>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm p-6 hover:shadow-xl transition-shadow border border-blue-200">
            <FaBriefcase className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Crecimiento Profesional</h3>
            <p className="text-blue-700">Desarrollo continuo y oportunidades de aprendizaje.</p>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm p-6 hover:shadow-xl transition-shadow border border-blue-200">
            <FaGraduationCap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-900">Capacitación Continua</h3>
            <p className="text-blue-700">Programas de formación y certificaciones.</p>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-blue-200">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Postúlate Ahora</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border-blue-900 focus:border-blue-950 rounded-xl shadow-xl focus:ring-blue-500 bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-blue-900 focus:border-blue-950 rounded-xl shadow-xl focus:ring-blue-500 bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full border-blue-900 focus:border-blue-950 rounded-xl shadow-xl focus:ring-blue-500 bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Años de Experiencia
                </label>
                <input
                  type="text"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  className="w-full border-blue-900  focus:border-blue-950 rounded-xl shadow-xl focus:ring-blue-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Educación
              </label>
              <textarea
                name="educacion"
                value={formData.educacion}
                onChange={handleChange}
                className="w-full min-h-[100px] p-3 border border-blue-200 rounded-md focus:border-blue-500 focus:ring-blue-500 shadow-xl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                ¿Por qué quieres unirte a nuestro equipo?
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className="w-full min-h-[150px] p-3 border border-blue-200 rounded-md focus:border-blue-500 focus:ring-blue-500 shadow-xl"
                required
              />
            </div>

            <div className="text-center">
              <button 
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl'
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CareerPage;

