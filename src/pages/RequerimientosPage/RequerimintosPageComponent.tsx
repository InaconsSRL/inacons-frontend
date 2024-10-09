import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, gql } from '@apollo/client';
import RequerimientosList from './RequerimientosList';
import Inventory from './Inventory';
import LoaderPage from '../../components/Loader/LoaderPage';
import { fetchObras } from '../../slices/obrasSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

const LIST_RECURSO = gql`
  query ListRecurso {
    listRecurso {
      nombre
      id
      codigo
    }
  }
`;

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


const RequerimintosPageComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'suppliers' | 'inventory'>('requests');

  const { loading, error, data } = useQuery(LIST_RECURSO);

  
  const dispatch = useDispatch<AppDispatch>();
  const { obras, loading: loadingObras, error: errorObras } = useSelector((state: RootState) => state.obra);
  
  useEffect(() => {
    dispatch(fetchObras());
  }, [dispatch]);

  console.log(obras)

  const renderActiveComponent = () => {
    // Pasar los datos de recursos a cada componente
    const recursos = data?.listRecurso || [];
    
    switch (activeTab) {
      case 'requests':
        return <RequerimientosList recursosList={recursos} obras={obras} />;
      case 'inventory':
        return <Inventory />;
      case 'suppliers':
        return <Inventory />;
    }
  };

  if (loading) return <LoaderPage />;
  if (error) return <p>Error al cargar recursos: {error.message}</p>;

  if (loadingObras) return <LoaderPage />;
  if (errorObras) return <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>Error: {error}</motion.div>;

  return (
    <motion.div
      className="flex flex-col h-full"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.header
        className="bg-white/70 p-4 shadow-lg rounded-3xl h-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            className="hidden md:flex bg-gradient-to-r from-cyan-700 via-purple-700 to-indigo-700 text-transparent bg-clip-text font-bold text-2xl"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Sección Requermientos
          </motion.div>
          <div className="flex items-center space-x-6">
            {['requests', 'suppliers', 'inventory'].map((tab, index) => (
              <motion.a
                key={tab}
                href="#"
                onClick={() => setActiveTab(tab as 'requests' | 'inventory' | 'suppliers')}
                className={`relative px-4 py-2 rounded-full ${activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500/ to-cyan-500 text-white font-medium'
                  : 'text-black hover:bg-white/70 bg-blue-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {tab === 'requests' && 'Lista de requerimientos'}
                {tab === 'suppliers' && 'Genera Requerimiento'}
                {tab === 'inventory' && 'Algo más'}
                {activeTab === tab && (
                  <motion.div
                    className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-white rounded-full"
                    layoutId="underline"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </nav>
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveComponent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default RequerimintosPageComponent;