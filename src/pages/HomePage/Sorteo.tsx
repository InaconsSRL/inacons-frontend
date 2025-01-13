import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import SpaceBackground from './SpaceBackground';

//Todo Ok

interface Participant {
  id: number;
  nickname: string;
}

const SorteoPage: React.FC = () => {
  const [participantCount, setParticipantCount] = useState<number>(111);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const participantsPerPage = 100;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnersPerStage, setWinnersPerStage] = useState<Participant[][]>([]);
  const [finalWinner, setFinalWinner] = useState<Participant | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [totalStages, setTotalStages] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sonidos (necesitarás agregar los archivos de audio)
  const [playDrum] = useSound('/sounds/drum.mp3');
  const [playTick] = useSound('/sounds/tick.mp3');
  const [playWin] = useSound('/sounds/win.mp3');

  const fireworkEffect = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const calcularCantidadGanadores = (total: number): number => {
    const raiz = Math.sqrt(total);
    return raiz % 1 >= 0.5 ? Math.ceil(raiz) : Math.floor(raiz);
  };

  const calculateStages = (participantCount: number): number => {
    let stages = 0;
    let remaining = participantCount;
    while (remaining > 1) {
      remaining = calcularCantidadGanadores(remaining);
      stages++;
    }
    return stages;
  };

  const startSorteo = async () => {
    setIsAnimating(true);
    playDrum();
    
    // Calcular número total de etapas
    const stages = calculateStages(participants.length);
    setTotalStages(stages);
    
    // Contador regresivo
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        playTick();
        return prev - 1;
      });
    }, 1000);

    let currentParticipants = [...participants];
    const newWinnersPerStage: Participant[][] = [];

    // Ejecutar sorteos por cada etapa
    for (let stage = 0; stage < stages; stage++) {
      setCurrentStage(stage + 1);
      const winnersCount = calcularCantidadGanadores(currentParticipants.length);
      
      // Animación de selección
      for (let i = 0; i < 10; i++) {
        const tempWinners = [...currentParticipants]
          .sort(() => Math.random() - 0.5)
          .slice(0, winnersCount);
        
        newWinnersPerStage[stage] = tempWinners;
        setWinnersPerStage([...newWinnersPerStage]);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Selección final de la etapa
      currentParticipants = [...currentParticipants]
        .sort(() => Math.random() - 0.5)
        .slice(0, winnersCount);
      newWinnersPerStage[stage] = currentParticipants;
      setWinnersPerStage([...newWinnersPerStage]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentParticipants.length === 1) {
        playWin();
        fireworkEffect();
        setFinalWinner(currentParticipants[0]);
      }
    }

    setIsAnimating(false);
  };

  const generateNickname = (id: number) => {
    const adjetivos = ['Veloz', 'Feroz', 'Místico', 'Épico', 'Legendario', 'Intrépido', 'Astuto', 'Radiante', 'Valiente', 'Sabio'];
    const sustantivos = ['Guerrero', 'Dragón', 'Fénix', 'Tigre', 'León', 'Halcón', 'Lobo', 'Águila', 'Ninja', 'Samurai'];
    const adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];
    const sustantivo = sustantivos[Math.floor(Math.random() * sustantivos.length)];
    
    return `#${id} ${adjetivo}${sustantivo}`;
  };

  const handleReset = () => {
    setCurrentStage(0);
    setTotalStages(0);
    setTimer(10);
    setWinnersPerStage([]);
    setFinalWinner(null);
    setIsAnimating(false);
    
    // Regenerar participantes
    const dummyParticipants = Array.from({ length: participantCount }, (_, i) => ({
      id: i + 1,
      nickname: generateNickname(i + 1)
    }));
    setParticipants(dummyParticipants);
  };

  const handleParticipantCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    // Limitar a un máximo de 10000 participantes
    setParticipantCount(Math.min(Math.max(value, 1), 20000));
  };

  // Función para obtener participantes de la página actual
  const getCurrentPageParticipants = () => {
    const startIndex = (currentPage - 1) * participantsPerPage;
    const endIndex = startIndex + participantsPerPage;
    return participants.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(participants.length / participantsPerPage);

  useEffect(() => {
    const dummyParticipants = Array.from({ length: participantCount }, (_, i) => ({
      id: i + 1,
      nickname: generateNickname(i + 1)
    }));
    setParticipants(dummyParticipants);
  }, [participantCount]);

  return (
    <div className="min-h-screen bg-[#0a0b1e] p-8 relative overflow-hidden">
      <SpaceBackground />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff00ff15] via-[#00ffff15] to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        <motion.h1 
          className="text-4xl font-bold text-center mb-4 text-[#00fff2] neon-text"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Sorteo Cyberpunk
        </motion.h1>

        {currentStage === 0 && (
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-white">Número de participantes:</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={participantCount}
                onChange={handleParticipantCountChange}
                className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {participantCount > 20000 && (
              <p className="text-red-400 text-sm">Máximo 20000 participantes permitidos</p>
            )}
            <motion.button
              onClick={startSorteo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            >
              Comenzar Sorteo Épico
            </motion.button>
          </div>
        )}

        {timer > 0 && (
          <motion.div 
            className="text-4xl text-center text-white mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {timer}s
          </motion.div>
        )}

        {/* Mostrar ganador final */}
        {finalWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4 p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-2">¡Ganador Final!</h2>
            <p className="text-3xl text-white">{finalWinner.nickname}</p>
          </motion.div>
        )}

        {currentStage > 0 && (
          <motion.button
            onClick={handleReset}
            className="mx-auto block bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reiniciar Sorteo
          </motion.button>
        )}

        {/* Panel de resultados */}
        <div className="flex flex-col gap-4">
          {[...winnersPerStage].reverse().map((winners, index) => {
            const actualStage = totalStages - index;
            return (
              <motion.div
                key={actualStage}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className="bg-purple-900/50 p-6 rounded-xl"
              >
                <h3 className="text-2xl text-white mb-4 flex justify-between items-center">
                  <span>Ronda {actualStage} ({winners.length} finalistas)</span>
                  {actualStage === totalStages && (
                    <span className="text-sm bg-purple-500 px-3 py-1.5 rounded">Ronda Final</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {winners.map((winner) => (
                    <motion.div
                      key={winner.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-3 ${
                        finalWinner?.id === winner.id 
                          ? 'bg-yellow-500' 
                          : actualStage === totalStages 
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                      } rounded-lg text-white text-center hover:scale-105 transition-transform duration-200`}
                    >
                      {winner.nickname}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lista de todos los participantes */}
        <div className="bg-purple-900/50 p-4 rounded-xl">
          <h3 className="text-xl text-white mb-2">Todos los Participantes ({participants.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto">
            {getCurrentPageParticipants().map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-2 rounded-lg text-center text-sm ${
                  winnersPerStage.flat().includes(participant)
                    ? 'bg-green-500 text-white'
                    : finalWinner?.id === participant.id
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/30 text-white'
                }`}
              >
                {participant.nickname}
              </motion.div>
            ))}
          </div>
          
          {/* Agregar controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-purple-500 rounded-md text-white disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-purple-500 rounded-md text-white disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS adicionales */}
      <style>{`
        .neon-text {
          text-shadow: 0 0 10px #00fff2,
                       0 0 20px #00fff2,
                       0 0 30px #00fff2,
                       0 0 40px #ff00ff;
        }
        
        @keyframes grid-animation {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        
        .bg-grid {
          animation: grid-animation 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SorteoPage;