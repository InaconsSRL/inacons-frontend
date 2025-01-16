import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store/store';
import { setDateRange, clearDateRange } from '../../slices/dateFilterSlice';
import { DateFilterProps, DateFilterState } from './types';

export const GlobalDateFilter: React.FC<DateFilterProps> = React.memo(({
  onFilterChange,
  className = '',
  theme = 'black'
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dateFilter = useSelector((state: RootState) => state.dateFilter);
  const [showFilters, setShowFilters] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split('T')[0];

  const allowedPaths = [
    '/dashboard/kanban',
    '/dashboard/requerimiento', 
    '/dashboard/compras', 
    '/dashboard/ordenCompra',
    '/dashboard/almacenBoard',
  ];
  
 

  // Añadir efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newState: DateFilterState = {
      ...dateFilter,
      [name]: value || null,
      ...(name === 'startDate' && !value ? { endDate: null } : {})
    };

    dispatch(setDateRange(newState));
    onFilterChange?.(newState);
  }, [dispatch, dateFilter, onFilterChange]);

  const handleClear = useCallback(() => {
    dispatch(clearDateRange());
    onFilterChange?.({ startDate: null, endDate: null });
    setShowEndDate(false);
  }, [dispatch, onFilterChange]);

  const handleHideFilters = useCallback(() => {
    setShowFilters(false);
    handleClear();
  }, [handleClear]);
  

  const isFiltering = useMemo(() => dateFilter.startDate || dateFilter.endDate, 
    [dateFilter.startDate, dateFilter.endDate]);

     // Si la ruta actual no está en las rutas permitidas, no renderizar nada
  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-md shadow hover:shadow-md flex items-center gap-1.5 
          ${theme === 'black' 
            ? `${isFiltering 
                ? 'from-green-700 to-green-600' 
                : 'from-blue-900 to-blue-700'
              } bg-gradient-to-r text-white border-blue-600`
            : `${isFiltering
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-blue-50 text-blue-600 border-blue-200'
              }`
        } border`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>{isFiltering ? 'Filtro Activo' : 'Filtrar por Fecha'}</span>
      </button>

      {showFilters && (
        <div className={`absolute z-50 right-0 top-12 mt-2 w-72 rounded-lg shadow-lg 
          animate-fade-in p-4 ${
            theme === 'black'
              ? 'bg-gray-900 border-blue-800'
              : 'bg-white border-gray-200'
          } border`}>
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${
              theme === 'black' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={theme === 'black' ? 'text-white' : 'text-gray-800'}>
                Filtros de Fecha
              </h3>
              <button
                onClick={handleHideFilters}
                className={`transition-colors duration-300 ${
                  theme === 'black' 
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className={theme === 'black' ? 'text-gray-300' : 'text-gray-600'}>
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateFilter.startDate || ''}
                  onChange={(e) => {
                    handleDateChange(e);
                    setShowEndDate(!!e.target.value);
                  }}
                  max={today}
                  className={`px-3 py-2 text-sm rounded-lg outline-none transition-all duration-300 ${
                    theme === 'black'
                      ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                  } border`}
                />
              </div>

              {showEndDate && (
                <div className="flex flex-col gap-1">
                  <label className={theme === 'black' ? 'text-gray-300' : 'text-gray-600'}>
                    Fecha final (opcional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={dateFilter.endDate || ''}
                    onChange={handleDateChange}
                    min={dateFilter.startDate || undefined}
                    max={today}
                    className={`px-3 py-2 text-sm rounded-lg outline-none transition-all duration-300 ${
                      theme === 'black'
                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400 focus:border-blue-400'
                    } border`}
                  />
                </div>
              )}

              <div className={`flex justify-end pt-2 border-t ${
                theme === 'black' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {isFiltering && (
                  <button
                    onClick={handleClear}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors duration-300 border ${
                      theme === 'black'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300'
                    }`}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});