import { gql } from '@apollo/client';
import client from '../apolloClient';

export const LIST_RECURSOS_QUERY = gql`
  query ListRecurso {
  listRecurso {
    id
    codigo
    nombre
    descripcion
    cantidad
    unidad_id
    precio_actual
    presupuesto
    tipo_recurso_id
    clasificacion_recurso_id
  }
  listTipoRecurso {
    id
    nombre
  }
  listUnidad {
    id
    nombre
  }
  listClasificacionRecurso {
    id
    nombre
    parent_id
    childs {
      nombre
      id
      parent_id
    }
  }
}
`;

export const ADD_RECURSO_MUTATION = gql`
  mutation Mutation($codigo: String!, $nombre: String!, $descripcion: String!, $cantidad: Int!, $unidadId: String!, $precioActual: Float!, $tipoRecursoId: String!, $clasificacionRecursoId: String!) {
    addRecurso(codigo: $codigo, nombre: $nombre, descripcion: $descripcion, cantidad: $cantidad, unidad_id: $unidadId, precio_actual: $precioActual, tipo_recurso_id: $tipoRecursoId, clasificacion_recurso_id: $clasificacionRecursoId) {
      id
      codigo
      nombre
      descripcion
      unidad_id
      precio_actual
      presupuesto
      tipo_recurso_id
      clasificacion_recurso_id
    }
  }
`;

export const UPDATE_RECURSO_MUTATION = gql`
  mutation UpdateRecurso($updateRecursoId: ID!, $codigo: String, $nombre: String, $descripcion: String, $fecha: String, $cantidad: Int, $unidadId: String, $precioActual: Float, $presupuesto: Boolean, $tipoRecursoId: String, $clasificacionRecursoId: String) {
    updateRecurso(id: $updateRecursoId, codigo: $codigo, nombre: $nombre, descripcion: $descripcion, fecha: $fecha, cantidad: $cantidad, unidad_id: $unidadId, precio_actual: $precioActual, presupuesto: $presupuesto, tipo_recurso_id: $tipoRecursoId, clasificacion_recurso_id: $clasificacionRecursoId) {
      id
      codigo
      nombre
      descripcion
      unidad_id
      precio_actual
      presupuesto
      tipo_recurso_id
      clasificacion_recurso_id
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
      variables: {
        codigo: recursoData.codigo,
        nombre: recursoData.nombre,
        descripcion: recursoData.descripcion,
        cantidad: recursoData.cantidad,
        unidadId: recursoData.unidad_id,
        precioActual: recursoData.precio_actual,
        tipoRecursoId: recursoData.tipo_recurso_id,
        clasificacionRecursoId: recursoData.clasificacion_recurso_id
      },
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
  try {
    const response = await client.mutate({
      mutation: UPDATE_RECURSO_MUTATION,
      variables: {
        updateRecursoId: recursoData.id,
        codigo: recursoData.codigo,
        nombre: recursoData.nombre,
        descripcion: recursoData.descripcion,
        fecha: recursoData.fecha,
        cantidad: recursoData.cantidad,
        unidadId: recursoData.unidad_id,
        precioActual: recursoData.precio_actual,
        presupuesto: recursoData.presupuesto,
        tipoRecursoId: recursoData.tipo_recurso_id,
        clasificacionRecursoId: recursoData.clasificacion_recurso_id
      },
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