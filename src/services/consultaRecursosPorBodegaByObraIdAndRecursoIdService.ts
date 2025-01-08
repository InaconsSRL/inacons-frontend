import { gql } from '@apollo/client';
import client from '../apolloClient';

// Definimos la interface para el tipo de respuesta
export interface RecursoBodega {
  obra_bodega_id: string;
  obra_id: string;
  nombre: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
  obra_bodega_recursos_id: string;
  existencia: string;
}

// Query GraphQL
const GET_RECURSOS_BY_OBRA_AND_RECURSO_ID = gql`
  query GetRecursosAndNotForObraAndRecursoId($obraId: ID!, $recursoId: ID!) {
    getRecursosAndNotForObraAndRecursoId(obraId: $obraId, recursoId: $recursoId) {
      obra_bodega_id
      obra_id
      nombre
      recurso_id
      cantidad
      costo
      obra_bodega_recursos_id
      existencia
    }
  }
`;

// Interface para los parámetros de la función
interface GetRecursosBodegaParams {
  obraId: string;
  recursoId: string;
}

// Función que realiza la consulta al servidor
export const consultaRecursosPorBodegaByObraIdAndRecursoIdService = async ({
  obraId,
  recursoId
}: GetRecursosBodegaParams): Promise<RecursoBodega[]> => {
  try {
    const { data, errors } = await client.query({
      query: GET_RECURSOS_BY_OBRA_AND_RECURSO_ID,
      variables: {
        obraId,
        recursoId
      },
      fetchPolicy: 'network-only'
    });

    if (errors?.length) {
      const errorMessage = errors[0]?.message || 'Error en la consulta de recursos';
      throw new Error(errorMessage);
    }

    if (!data?.getRecursosAndNotForObraAndRecursoId) {
      throw new Error('No se recibieron datos de recursos');
    }

    return data.getRecursosAndNotForObraAndRecursoId;
  } catch (error) {
    console.error('Error al consultar recursos por bodega:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido en la consulta de recursos');
  }
};