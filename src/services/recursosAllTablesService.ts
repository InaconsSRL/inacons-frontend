import { gql } from '@apollo/client';
import client from '../apolloClient';

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
    });
    
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.getCountRecursosInAllTablesBySolicitudId;
  } catch (error) {
    console.error('Error al obtener el conteo de recursos:', error);
    throw error;
  }
};
