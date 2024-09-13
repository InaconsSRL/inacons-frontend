import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_RECURSOS_QUERY = gql`
  query ListRecurso {
    listRecurso {
      id
      codigo
      nombre
      descripcion
      fecha
      cantidad
      unidad
      precio_actual
      presupuesto
      tipo_recurso
      clasificacion_recurso
    }  
  }
`;

const ADD_RECURSO_MUTATION = gql`
  mutation AddRecurso($codigo: String!, $nombre: String!, $descripcion: String!, $cantidad: Int!, $unidadId: ID!, $precioActual: Float!, $tipoRecursoId: ID!, $clasificacionRecursoId: ID!) {
    addRecurso(codigo: $codigo, nombre: $nombre, descripcion: $descripcion, cantidad: $cantidad, unidad_id: $unidadId, precio_actual: $precioActual, tipo_recurso_id: $tipoRecursoId, clasificacion_recurso_id: $clasificacionRecursoId) {
      id
      codigo
      nombre
      descripcion
      fecha
      cantidad
      unidad
      precio_actual
      presupuesto
      tipo_recurso
      clasificacion_recurso
    }
  }
`;

const UPDATE_RECURSO_MUTATION = gql`
  mutation UpdateRecurso($updateRecursoId: ID!, $codigo: String, $nombre: String, $descripcion: String, $fecha: String, $cantidad: Int, $unidadId: ID, $precioActual: Float, $presupuesto: Boolean, $tipoRecursoId: ID, $clasificacionRecursoId: ID) {
    updateRecurso(id: $updateRecursoId, codigo: $codigo, nombre: $nombre, descripcion: $descripcion, fecha: $fecha, cantidad: $cantidad, unidad_id: $unidadId, precio_actual: $precioActual, presupuesto: $presupuesto, tipo_recurso_id: $tipoRecursoId, clasificacion_recurso_id: $clasificacionRecursoId) {
      id
      codigo
      nombre
      descripcion
      fecha
      cantidad
      unidad
      precio_actual
      presupuesto
      tipo_recurso
      clasificacion_recurso
    }
  }
`;

export const listRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_RECURSOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de recursos:', error);
    throw error;
  }
};

export const addRecursoService = async (recursoData) => {
  try {
    const response = await client.mutate({
      mutation: ADD_RECURSO_MUTATION,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addRecurso;
  } catch (error) {
    console.error('Error al crear el recurso:', error);
    throw error;
  }
};

export const updateRecursoService = async (recursoData) => {
  console.log(recursoData)
  try {
    const response = await client.mutate({
      mutation: UPDATE_RECURSO_MUTATION,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateRecurso;
  } catch (error) {
    console.error('Error al actualizar el recurso:', error);
    throw error;
  }
};