
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
      listAlmacenRecursos {
        recurso_id
        cantidad
        almacen_id
        costo
        nombre_almacen
        _id
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