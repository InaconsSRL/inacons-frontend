import React from 'react';
import { FaFileAlt, FaDownload, FaEye, FaWhatsapp } from 'react-icons/fa';
import doc1 from "../../../assets/HomologacionProveedores/0. CLÁUSULA ANTICORRUPCIÓN.pdf"
import doc2 from "../../../assets/HomologacionProveedores/0. PO-SIG-001 Politica SIG Vr. 10.pdf"
import doc3 from "../../../assets/HomologacionProveedores/0. PR-AS-002 Pr. Gestión de Denuncias y Consultas.pdf"
import doc4 from "../../../assets/HomologacionProveedores/1. FO-AS-002_Cuestionario de Socios de Negocio.pdf"
import doc5 from "../../../assets/HomologacionProveedores/2. FO-AS-004_Carta_de_compromiso_antisoborno-Persona_juridica.pdf"
import bg from '../../../assets/bgmedia.gif'

interface ProviderData {
  name: string;
  id: string;
  email: string; // Nuevo campo
  documents: { id: number; name: string; type: string; file: string }[];
}
const DOCUMENTS = [
  { id: 1, name: 'CLÁUSULA ANTICORRUPCIÓN', type: 'view', file: doc1 },
  { id: 2, name: 'Política SIG', type: 'view', file: doc2 },
  { id: 3, name: 'Procedimiento Gestión de Denuncias', type: 'view', file: doc3 },
  { id: 4, name: 'Cuestionario de Socios de Negocio', type: 'fill', file: doc4 },
  { id: 5, name: 'Carta de compromiso antisoborno', type: 'fill', file: doc5 }
];

const HomologacionFormPage: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [providerData, setProviderData] = React.useState<ProviderData | null>(null);

  const handleCodeSubmit = () => {
    if (code.trim() === '') {
      alert('Por favor ingrese un código');
      return;
    }
    if (code === '123456') {
      setProviderData({
        name: 'Proveedor Example',
        id: 'PRV001',
        email: 'proveedor@example.com', // Email del proveedor
        documents: DOCUMENTS
      });
    } else {
      alert('Código inválido');
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/51940398392', '_blank');
  };

  return (
    <div className='' style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>

      <div className='min-h-screen bg-gradient-to-br from-blue-950/30 via-blue-950/30 to-blue-950/30 backdrop-blur-sm p-6' >
        <div className="container mx-auto max-w-6xl">
          {!providerData ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 overflow-hidden mt-[30vh]">
              <div className="border-b rounded-3xl" style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'expand',
              }}>
                <div className='bg-gradient-to-br py-20 from-blue-950/20 via-blue-950/20 to-blue-950/20 backdrop-blur w-full h-full p-4 rounded-3xl'>

                  <h2 className="text-2xl font-bold mb-4 text-white text-center">
                    <span className="bg-clip-text text-transparent text-white text-[30px] bg-gradient-to-r from-slate-700 to-slate-900">
                      Portal de Homologación de Proveedores
                    </span>
                  </h2>
                  <div className="flex gap-3 max-w-md mx-auto ">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm text-lg"
                      placeholder="Ingrese su código"
                    />
                    <button
                      onClick={handleCodeSubmit}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-600 transition duration-300 shadow-lg hover:shadow-xl font-semibold"
                    >
                      Verificar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 overflow-hidden">
                <div className="border-b rounded-3xl mb-4" style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'expand',
                }}>
                  <div className='bg-gradient-to-br from-blue-950/20 via-blue-950/20 to-blue-950/20 backdrop-blur w-full h-full p-4 rounded-3xl'>

                    <h1 className="text-3xl text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
                      {providerData.name}
                    </h1>
                    <p className="text-black bg-white text-center rounded-lg w-[100px] text-base mt-1 ">ID: {providerData.id}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {providerData.documents.map((doc) => (
                    <div key={doc.id} className={`${doc.type === 'fill' ? "bg-zinc-50" : "bg-white"} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`${doc.type === 'fill' ? "bg-green-200" : "bg-slate-200"} p-2.5  rounded-lg`}>
                            <FaFileAlt className="text-lg text-slate-700" />
                          </div>
                          <h3 className="font-bold text-base text-gray-800">{doc.name}</h3>
                        </div>

                        {doc.type === 'fill' ? (
                          <div className="space-y-3">
                            <a
                              href={doc.file as string}
                              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 group bg-green-200 p-2.5 rounded-lg transition-all duration-200 hover:bg-slate-100"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaDownload className="text-base group-hover:scale-110 transition" />
                              <span className="font-medium text-sm">Descargar PDF</span>
                            </a>
                          </div>
                        ) : (
                          <a
                            href={doc.file as string}
                            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 group bg-slate-200 p-2.5 rounded-lg transition-all duration-200 hover:bg-slate-100"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaEye className="text-base group-hover:scale-110 transition" />
                            <span className="font-medium text-sm">Ver PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl shadow-xl p-6 border border-slate-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Instrucciones Importantes:</h3>
                    <ol className="list-decimal ml-5 space-y-2 text-gray-700 text-xs">
                      <li>Imprimir el documento</li>
                      <li>Rellenar la información solicitada</li>
                      <li>Firmar el documento</li>
                      <li>Escanear o tomar foto clara</li>
                      <li>Convertir a PDF</li>
                      <li>Subir el archivo</li>
                    </ol>
                  </div>
                  <div className="text-center">
                    <p className="mb-3 text-gray-700 font-medium text-sm">¿Necesitas ayuda?</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={openWhatsApp}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm"
                      >
                        <FaWhatsapp className="text-lg" />
                        <span className="font-medium">+51 940 398 392</span>
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomologacionFormPage;