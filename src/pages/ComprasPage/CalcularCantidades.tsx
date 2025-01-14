interface RecursosCotizacion {
  cantidad: number;
}

interface Cotization {
  id: string;
  estado: string;
  recursos_cotizacion: RecursosCotizacion;
}

interface RecursoProveedor {
  cantidad: number;
}

interface Proveedores {
  id: string;
  estado: string;
  recursos_proveedor: RecursoProveedor[];
}

interface RecursosOrden {
  cantidad: number;
}

interface OrdenCompras {
  id: string;
  cotizacion_id: string;
  recursos_orden: RecursosOrden[];
}

interface RecursosTransferencia {
  cantidad: number;
}

interface Transferencias {
  referencia_id: string;
  recursos_transferencia: RecursosTransferencia[];
}

interface AllRecursosTotal {
  recurso_id: string;
  cantidad_solicitud: number | null;
  cotizaciones: Cotization[];
  tabla_proveedores: Proveedores[];
  tabla_ordenes_compra: OrdenCompras[];
  tabla_transferencias: Transferencias[];
}

export const CalcularCantidades = (
  recursosAllTables: AllRecursosTotal[], 
  recursoId: string
): number => {
    
  const recursoEncontrado = recursosAllTables.find(
    recurso => recurso.recurso_id === recursoId
  ) || {} as AllRecursosTotal;

  const sumaCotizaciones = recursoEncontrado.cotizaciones?.filter(
    cot => cot.estado !== "OCGenerada"
  ).reduce(
    (sum, cot) => sum + (cot.recursos_cotizacion?.cantidad || 0), 
    0
  ) || 0;

  const sumaProveedores = recursoEncontrado.tabla_proveedores?.filter(
    prov => prov.estado === "buenaProAdjudicada"
  ).reduce(
    (sum, prov) => sum + (prov.recursos_proveedor?.[0]?.cantidad || 0),
    0
  ) || 0;

  const sumaOrdenes = recursoEncontrado.tabla_ordenes_compra?.reduce(
    (sum, orden) => sum + (orden.recursos_orden?.[0]?.cantidad || 0),
    0
  ) || 0;

  const sumaTransferencias = recursoEncontrado.tabla_transferencias?.reduce(
    (sum, trans) => sum + (trans.recursos_transferencia?.[0]?.cantidad || 0),
    0
  ) || 0;

  //console.log(sumaCotizaciones, sumaProveedores, sumaOrdenes, sumaTransferencias);
  return (sumaCotizaciones + sumaProveedores + sumaOrdenes + sumaTransferencias);
};