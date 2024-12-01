import React from 'react';

export interface Cotizacion {
  id: string;
  codigo_cotizacion: string;
  estado: string;
  fecha_solicitud: string;
  title?: string;
  color?: string;
  moneda?: string;
  total?: number;
  proveedor_id?: string;
  observaciones?: string;
}

export interface KanbanCardCotizacionProps {
  column: {
    id: string;
    title: string;
    color: string;
    cotizacion: Cotizacion;
  };
}

export interface ColumnCotizacion {
  id: string;
  title: string;
  color: string;
  cotizacion: Cotizacion[];
}

interface KanbanColumnCotizacionProps {
  columna: ColumnCotizacion;
  CardComponentC: React.ComponentType<KanbanCardCotizacionProps>;
}

const KanbanColumnCotizacion: React.FC<KanbanColumnCotizacionProps> = ({
  columna,
  CardComponentC
}) => {
  return (
    <div className="flex-shrink-0 w-[250px] bg-white/10 rounded-lg shadow-lg scale-90 lg:scale-100 min-h-[69vh] max-h-[calc(100vh-300px)] ">
      <div className="p-4 rounded-t-lg" style={{ backgroundColor: columna.color }}>
        <h2 className="text-sm font-semibold flex justify-between items-center text-white">
          {columna.title}
          <span className="text-sm font-normal bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
            {columna.cotizacion?.length ?? 0}
          </span>
        </h2>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
        {(columna.cotizacion ?? []).map((req) => (
          <CardComponentC
            key={req.id} 
            column={{
              id: columna.id,
              title: columna.title,
              color: columna.color,
              cotizacion: req
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumnCotizacion;