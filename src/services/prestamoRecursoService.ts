import { gql } from '@apollo/client';
import client from '../apolloClient';

// Queries
const LIST_PRESTAMO_RECURSOS = gql`
  query ListPrestamoRecursos {
    listPrestamoRecursos {
      id
      cantidad
      bodega_id {
        id
        codigo
        descripcion
      }
      observaciones
      prestamo_id {
        id
      }
      recurso_id {
        id
        imagenes {
          file
          id
          recurso_id
        }
        cantidad
        clasificacion_recurso_id
        codigo
        descripcion
        fecha
        nombre
        precio_actual
        tipo_costo_recurso_id
        tipo_recurso_id
        unidad_id
        vigente
      }
    }
  }
`;

const ADD_PRESTAMO_RECURSO = gql`
  mutation AddPrestamoRecurso(
    $cantidad: Float!
    $bodega_id: ID!
    $observaciones: String
    $prestamo_id: ID!
    $recurso_id: ID!
  ) {
    addPrestamoRecurso(
      cantidad: $cantidad
      bodega_id: $bodega_id
      observaciones: $observaciones
      prestamo_id: $prestamo_id
      recurso_id: $recurso_id
    ) {
      id
      cantidad
      bodega_id {
        id
        codigo
        descripcion
      }
      observaciones
      prestamo_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        precio_actual
      }
    }
  }
`;

const UPDATE_PRESTAMO_RECURSO = gql`
  mutation UpdatePrestamoRecurso(
    $id: ID!
    $cantidad: Float
    $bodega_id: ID
    $observaciones: String
    $prestamo_id: ID
    $recurso_id: ID
  ) {
    updatePrestamoRecurso(
      id: $id
      cantidad: $cantidad
      bodega_id: $bodega_id
      observaciones: $observaciones
      prestamo_id: $prestamo_id
      recurso_id: $recurso_id
    ) {
      id
      cantidad
      bodega_id {
        id
        codigo
        descripcion
      }
      observaciones
      prestamo_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        precio_actual
      }
    }
  }
`;

const DELETE_PRESTAMO_RECURSO = gql`
  mutation DeletePrestamoRecurso($id: ID!) {
    deletePrestamoRecurso(id: $id) {
      id
    }
  }
`;

// Service functions
export const listPrestamoRecursosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRESTAMO_RECURSOS,
    });
    return data.listPrestamoRecursos;
  } catch (error) {
    console.error('Error fetching prestamo recursos:', error);
    throw error;
  }
};

export const addPrestamoRecursoService = async (prestamoRecursoData: {
  cantidad: number;
  bodega_id: string;
  observaciones?: string;
  prestamo_id: string;
  recurso_id: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRESTAMO_RECURSO,
      variables: prestamoRecursoData,
    });
    return data.addPrestamoRecurso;
  } catch (error) {
    console.error('Error adding prestamo recurso:', error);
    throw error;
  }
};

export const updatePrestamoRecursoService = async (prestamoRecursoData: {
  id: string;
  cantidad?: number;
  bodega_id?: string;
  observaciones?: string;
  prestamo_id?: string;
  recurso_id?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRESTAMO_RECURSO,
      variables: prestamoRecursoData,
    });
    return data.updatePrestamoRecurso;
  } catch (error) {
    console.error('Error updating prestamo recurso:', error);
    throw error;
  }
};

export const deletePrestamoRecursoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRESTAMO_RECURSO,
      variables: { id },
    });
    return data.deletePrestamoRecurso.id;
  } catch (error) {
    console.error('Error deleting prestamo recurso:', error);
    throw error;
  }
};
