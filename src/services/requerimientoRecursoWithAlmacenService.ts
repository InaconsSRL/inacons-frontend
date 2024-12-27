import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_REQUERIMIENTO_RECURSO_WITH_ALMACEN = gql`
  query GetRequerimientoRecursoByRequerimientoIdWithAlmacenQuantities($requerimientoId: ID!) {
    getRequerimientoRecursoByRequerimientoIdWithAlmacenQuantities(requerimiento_id: $requerimientoId) {
      id
      requerimiento_id
      recurso_id
      nombre
      codigo
      unidad
      cantidad
      cantidad_aprobada
      estado
      notas
      costo_ref
      fecha_limit
      presupuestado
      list_obra_bodega_recursos {
        obra_id
        cantidad_total_obra
        obra_nombre
        bodegas {
          obra_bodega_id
          nombre
          cantidad
          costo
        }
      }
    }
  }
`;

export const getRequerimientoRecursoWithAlmacen = async (requerimientoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_REQUERIMIENTO_RECURSO_WITH_ALMACEN,
      variables: { requerimientoId },
    });
    return data.getRequerimientoRecursoByRequerimientoIdWithAlmacenQuantities;
  } catch (error) {
    throw new Error(`Error fetching requerimiento recursos with almacen: ${error}`);
  }
};