import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: { id: string; file: string }[];
  alt: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrev = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNext = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleThumbnailClick = (index: number) => {
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

/*   const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      event.preventDefault();
      setIsFullscreen(false);
    }
  }, [isFullscreen]); */

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isFullscreen]);

  const direction = currentIndex > prevIndex ? 1 : -1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-2xl bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-slate-500/10">
      <div className="w-auto min-w-[300px] h-80 relative">
        <AnimatePresence custom={direction} initial={false}>
          <motion.img
            key={images[currentIndex].id}
            src={images[currentIndex].file}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover absolute top-0 left-0 cursor-pointer"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            onClick={toggleFullscreen}
          />
        </AnimatePresence>
      </div>

      {/* Contador de imágenes */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 text-center">
        <span className="text-sm font-semibold">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Botones de navegación */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={handlePrev}
        aria-label="Imagen anterior"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={handleNext}
        aria-label="Imagen siguiente"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Miniaturas */}
      <div className="mt-4 flex justify-center space-x-2 p-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(index)}
            className={`border-2 ${
              currentIndex === index ? 'border-blue-300' : 'border-transparent'
            } rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-105`}
          >
            <img
              src={image.file}
              alt={`${alt} - Miniatura ${index + 1}`}
              className="w-16 h-16 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Vista de pantalla completa */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-90 z-50 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <img
            src={images[currentIndex].file}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
            onClick={toggleFullscreen}
            aria-label="Cerrar vista completa"
          >
            <FiX className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;