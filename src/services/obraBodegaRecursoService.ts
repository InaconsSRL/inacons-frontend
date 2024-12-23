import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_OBRA_BODEGA_RECURSOS = gql`
  query ListObraBodegaRecursos {
    listObraBodegaRecursos {
      id
      obra_bodega_id {
        id
        nombre
        codigo
        estado
      }
      recurso_id {
        id
        nombre
        codigo
        unidad_id
        cantidad
        descripcion
        precio_actual
        imagenes {
          file
        }
      }
      cantidad
      costo
      estado
    }
  }
`;

const LIST_OBRA_BODEGA_RECURSOS_BY_BODEGA = gql`
  query ListObraBodegaRecursosByObraBodegaId($obraBodegaId: ID!) {
    listObraBodegaRecurosByObraBodegaId(obraBodegaId: $obraBodegaId) {
      id
      obra_bodega_id {
        id
        nombre
        codigo
        estado
      }
      recurso_id {
        id
        nombre
        codigo
        unidad_id
        cantidad
        descripcion
        precio_actual
        imagenes {
          file
        }
      }
      cantidad
      costo
      estado
    }
  }
`;

const ADD_OBRA_BODEGA_RECURSO = gql`
  mutation AddObraBodegaRecurso($obraBodegaId: ID!, $recursoId: ID!, $cantidad: Float!, $costo: Float!, $estado: String!) {
    addObraBodegaRecurso(obra_bodega_id: $obraBodegaId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, estado: $estado) {
      id
      obra_bodega_id {
        id
        nombre
        codigo
        estado
      }
      recurso_id {
        id
        nombre
        codigo
        unidad_id
        cantidad
        descripcion
        precio_actual
        imagenes {
          file
        }
      }
      cantidad
      costo
      estado
    }
  }
`;

const UPDATE_OBRA_BODEGA_RECURSO = gql`
  mutation UpdateObraBodegaRecurso($updateObraBodegaRecursoId: ID!, $obraBodegaId: ID!, $recursoId: ID!, $cantidad: Float!, $costo: Float!, $estado: String!) {
    updateObraBodegaRecurso(id: $updateObraBodegaRecursoId, obra_bodega_id: $obraBodegaId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo, estado: $estado) {
      id
      obra_bodega_id {
        id
        nombre
        codigo
        estado
      }
      recurso_id {
        id
        nombre
        codigo
        unidad_id
        cantidad
        descripcion
        precio_actual
        imagenes {
          file
        }
      }
      cantidad
      costo
      estado
    }
  }
`;

const DELETE_OBRA_BODEGA_RECURSO = gql`
  mutation DeleteObraBodegaRecurso($deleteObraBodegaRecursoId: ID!) {
    deleteObraBodegaRecurso(id: $deleteObraBodegaRecursoId) {
      id
    }
  }
`;

export const listObraBodegaRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_OBRA_BODEGA_RECURSOS,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listObraBodegaRecursos;
  } catch (error) {
    console.error('Error al listar recursos de bodega:', error);
    throw error;
  }
};

export const listObraBodegaRecursosByBodegaService = async (obraBodegaId: string) => {
  try {
    const response = await client.query({
      query: LIST_OBRA_BODEGA_RECURSOS_BY_BODEGA,
      variables: { obraBodegaId },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listObraBodegaRecursosByObraBodegaId;
  } catch (error) {
    console.error('Error al listar recursos por bodega:', error);
    throw error;
  }
};

export const addObraBodegaRecursoService = async (recursoData: {
  obraBodegaId: string;
  recursoId: string;
  cantidad: number;
  costo: number;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_OBRA_BODEGA_RECURSO,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addObraBodegaRecurso;
  } catch (error) {
    console.error('Error al agregar recurso a bodega:', error);
    throw error;
  }
};

export const updateObraBodegaRecursoService = async (recursoData: {
  updateObraBodegaRecursoId: string;
  obraBodegaId: string;
  recursoId: string;
  cantidad: number;
  costo: number;
  estado: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_OBRA_BODEGA_RECURSO,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateObraBodegaRecurso;
  } catch (error) {
    console.error('Error al actualizar recurso de bodega:', error);
    throw error;
  }
};

export const deleteObraBodegaRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_OBRA_BODEGA_RECURSO,
      variables: { deleteObraBodegaRecursoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteObraBodegaRecurso;
  } catch (error) {
    console.error('Error al eliminar recurso de bodega:', error);
    throw error;
  }
};
