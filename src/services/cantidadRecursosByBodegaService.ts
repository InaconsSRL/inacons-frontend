import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_RECURSOS_FOR_OBRA_AND_RECURSO_ID = gql`
  query GetRecursosForObraAndRecursoId($obraId: ID!, $recursoId: ID!) {
    getRecursosForObraAndRecursoId(obraId: $obraId, recursoId: $recursoId) {
      cantidad
      nombre
    }
  }
`;

interface GetRecursosForObraAndRecursoIdResponse {
  getRecursosForObraAndRecursoId: {
    cantidad: number;
    nombre: string;
  }[];
}

export const getRecursosForObraAndRecursoId = async (obraId: string, recursoId: string): Promise<GetRecursosForObraAndRecursoIdResponse['getRecursosForObraAndRecursoId']> => {
  try {
    const { data } = await client.query<GetRecursosForObraAndRecursoIdResponse>({
      query: GET_RECURSOS_FOR_OBRA_AND_RECURSO_ID,
      variables: { obraId, recursoId },
    });
    return data.getRecursosForObraAndRecursoId;
  } catch (error) {
    console.error('Error fetching recursos:', error);
    throw error;
  }
};
