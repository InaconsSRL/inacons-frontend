import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchProyectos, deleteProyecto, Proyecto } from '../../../slices/proyectoSlice';
import { getPresupuestosByProyecto } from '../../../slices/presupuestoSlice';
import { FiChevronDown, FiChevronRight, FiFileText, FiFolder, FiTrash2 } from 'react-icons/fi';
import { setActiveProyecto, clearActiveProyecto, clearActivePresupuesto, clearActiveTitulo } from '../../../slices/activeDataSlice';

interface TreeItemProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  isProject?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const TreeItem: React.FC<TreeItemProps> = ({
  title,
  isExpanded,
  onToggle,
  isProject = false,
  isActive = false,
  children,
  onDelete,
  showDeleteButton = false
}) => {
  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 text-cyan-100 shadow-sm' 
            : 'hover:bg-gray-800/30'}`}
      >
        <div className="flex-grow flex items-center gap-2" onClick={onToggle}>
          <span className="w-4 h-4 flex items-center">
            {isExpanded ? (
              <FiChevronDown className="w-4 h-4 text-cyan-300" />
            ) : (
              <FiChevronRight className="w-4 h-4 text-cyan-300" />
            )}
          </span>
          {isProject ? (
            <FiFolder className={`w-4 h-4 min-w-4 flex-shrink-0 ${isActive ? 'text-cyan-300' : 'text-blue-400'}`} />
          ) : (
            <FiFileText className="w-4 h-4 min-w-4 text-emerald-400" />
          )}
          <span className="text-xs text-slate-200 font-medium">{title}</span>
        </div>
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="ml-6 border-l border-gray-700/50">
          {children}
        </div>
      )}
    </div>
  );
};

const ListaProyectos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const proyectos = useSelector((state: RootState) => state.proyecto.proyectos);
  const presupuestos = useSelector((state: RootState) => state.presupuesto.presupuestos);
  const activeProyecto = useSelector((state: RootState) => state.activeData.activeProyecto);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchProyectos());
  }, [dispatch]);

  const handleToggleProject = async (project: Proyecto) => {
    // Actualizar el proyecto activo
    dispatch(setActiveProyecto(project));

    // Manejar la expansión/colapso
    const projectId = project.id_proyecto;
    const newExpanded = new Set(expandedProjects);
    
    if (expandedProjects.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
      // Solo cargaremos los presupuestos si estamos expandiendo y no los tenemos ya
      if (!presupuestos.some(p => p.id_proyecto === projectId)) {
        await dispatch(getPresupuestosByProyecto(projectId));
      }
    }
    
    setExpandedProjects(newExpanded);
  };

  const handleNewProject = () => {
    dispatch(clearActiveProyecto());
    dispatch(clearActivePresupuesto());
    dispatch(clearActiveTitulo());
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      await dispatch(deleteProyecto(projectId));
      if (activeProyecto?.id_proyecto === projectId) {
        dispatch(clearActiveProyecto());
      }
    }
  };

  const getProjectPresupuestos = (projectId: string) => {
    return presupuestos.filter(p => p.id_proyecto === projectId);
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold text-gray-100">Lista de Proyectos</h2>
          <button
            onClick={handleNewProject}
            className="flex py-2 text-xs text-white items-center w-auto gap-2 px-4 bg-cyan-600 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            + Proyectos
          </button>
        </div>
        <div className="space-y-2">
          {proyectos.map(proyecto => (
            <TreeItem
              key={proyecto.id_proyecto}
              title={proyecto.nombre_proyecto}
              isExpanded={expandedProjects.has(proyecto.id_proyecto)}
              onToggle={() => handleToggleProject(proyecto)}
              isProject={true}
              isActive={activeProyecto?.id_proyecto === proyecto.id_proyecto}
              showDeleteButton={!getProjectPresupuestos(proyecto.id_proyecto).length}
              onDelete={() => handleDeleteProject(proyecto.id_proyecto)}
            >
              {getProjectPresupuestos(proyecto.id_proyecto).map(presupuesto => (
              <TreeItem
                key={presupuesto.id_presupuesto}
                title={`${(presupuesto.numeracion_presupuesto ?? 0).toString().padStart(2, '0')}. ${presupuesto.nombre_presupuesto || 'Sin descripción'}`}
                isExpanded={false}
                onToggle={() => {}}
              />
              ))}
            </TreeItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaProyectos;