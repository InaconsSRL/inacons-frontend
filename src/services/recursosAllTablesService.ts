import { gql } from '@apollo/client';
import client from '../apolloClient';

interface RecursoCotizacion {
  cantidad: number;
  __typename: 'RecursosCotizacion';
}

interface Cotizacion {
  id: string;
  estado: string;
  recursos_cotizacion: RecursoCotizacion;
  __typename: 'Cotization';
}

interface RecursoProveedor {
  cantidad: number;
  __typename: 'RecursoProveedor';
}

interface Proveedor {
  id: string;
  estado: string;
  recursos_proveedor: RecursoProveedor[];
  __typename: 'Proveedores';
}

interface RecursoOrden {
  cantidad: number;
  __typename: 'RecursosOrden';
}

interface OrdenCompra {
  id: string;
  cotizacion_id: string;
  recursos_orden: RecursoOrden[];
  __typename: 'OrdenCompras';
}

interface RecursoTransferencia {
  cantidad: number;
  __typename: 'RecursosTransferencia';
}

interface Transferencia {
  referencia_id: string;
  recursos_transferencia: RecursoTransferencia[];
  __typename: 'Transferencias';
}

interface RecursoAllTables {
  recurso_id: string;
  cantidad_solicitud: number | null;
  cotizaciones: Cotizacion[];
  tabla_proveedores: Proveedor[];
  tabla_ordenes_compra: OrdenCompra[];
  tabla_transferencias: Transferencia[];
  __typename: 'AllRecursosTotal';
}

const GET_COUNT_RECURSOS_ALL_TABLES = gql`
  query GetCountRecursosInAllTablesBySolicitudId($solicitudCompraId: ID!) {
    getCountRecursosInAllTablesBySolicitudId(solicitud_compra_id: $solicitudCompraId) {
      recurso_id
      cantidad_solicitud
      cotizaciones {
        id
        estado
        recursos_cotizacion {
          cantidad
        }
      }
      tabla_proveedores {
        id
        estado
        recursos_proveedor {
          cantidad
        }
      }
      tabla_ordenes_compra {
        id
        cotizacion_id
        recursos_orden {
          cantidad
        }
      }
      tabla_transferencias {
        referencia_id
        recursos_transferencia {
          cantidad
        }
      }
    }
  }
`;

export const getCountRecursosInAllTablesService = async (solicitudCompraId: string) => {
  try {
    const response = await client.query({
      query: GET_COUNT_RECURSOS_ALL_TABLES,
      variables: { solicitudCompraId },
      fetchPolicy: 'no-cache' // Forzar que no use caché
    });
    
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    const data = response.data.getCountRecursosInAllTablesBySolicitudId as RecursoAllTables[];
    return data.map((item: RecursoAllTables) => ({
      ...item,
      cotizaciones: item.cotizaciones?.map((cot: Cotizacion) => ({
        ...cot,
        recursos_cotizacion: {
          ...cot.recursos_cotizacion,
          cantidad: Number(cot.recursos_cotizacion.cantidad)
        }
      })),
      tabla_proveedores: item.tabla_proveedores?.map((prov: Proveedor) => ({
        ...prov,
        recursos_proveedor: prov.recursos_proveedor?.map((rec: RecursoProveedor) => ({
          ...rec,
          cantidad: Number(rec.cantidad)
        }))
      })),
      tabla_ordenes_compra: item.tabla_ordenes_compra?.map((ord: OrdenCompra) => ({
        ...ord,
        recursos_orden: ord.recursos_orden?.map((rec: RecursoOrden) => ({
          ...rec,
          cantidad: Number(rec.cantidad)
        }))
      })),
      tabla_transferencias: item.tabla_transferencias?.map((trans: Transferencia) => ({
        ...trans,
        recursos_transferencia: trans.recursos_transferencia?.map((rec: RecursoTransferencia) => ({
          ...rec,
          cantidad: Number(rec.cantidad)
        }))
      }))
    }));
  } catch (error) {
    console.error('Error al obtener el conteo de recursos:', error);
    throw error;
  }
};
