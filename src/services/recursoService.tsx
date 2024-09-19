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
    fecha
    imagenes {
      id
      file
    }
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
  mutation AddRecurso($codigo: String!, $nombre: String!, $descripcion: String!, $cantidad: Int!, $unidad_id: String!, $precioActual: Float!, $tipo_recurso_id: String!, $clasificacion_recurso_id: String!) {
    addRecurso(codigo: $codigo, nombre: $nombre, descripcion: $descripcion, cantidad: $cantidad, unidad_id: $unidad_id, precio_actual: $precioActual, tipo_recurso_id: $tipo_recurso_id, clasificacion_recurso_id: $clasificacion_recurso_id) {
    id
    codigo
    nombre
    descripcion
    fecha
    cantidad
    unidad_id
    precio_actual
    presupuesto
    tipo_recurso_id
    clasificacion_recurso_id
    }
  }
`;

export const UPDATE_RECURSO_MUTATION = gql`
  mutation UpdateRecurso($updateRecursoId: ID!, $codigo: String, $nombre: String, $descripcion: String, $fecha: String, $cantidad: Int, $unidad_id: String, $precioActual: Float, $presupuesto: Boolean, $tipo_recurso_id: String, $clasificacion_recurso_id: String) {
    updateRecurso(id: $updateRecursoId, codigo: $codigo, nombre: $nombre, descripcion: $descripcion, fecha: $fecha, cantidad: $cantidad, unidad_id: $unidad_id, precio_actual: $precioActual, presupuesto: $presupuesto, tipo_recurso_id: $tipo_recurso_id, clasificacion_recurso_id: $clasificacion_recurso_id) {
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


interface AddRecursoInput {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
}

interface UpdateRecursoInput {
  id: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  fecha?: string;
  cantidad?: number;
  unidad_id?: string;
  precio_actual?: number;
  presupuesto?: boolean;
  tipo_recurso_id?: string;
  clasificacion_recurso_id?: string;
}

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

export const addRecursoService = async (recursoData: AddRecursoInput) => {
  console.log(recursoData)
  try {
    const response = await client.mutate({
      mutation: ADD_RECURSO_MUTATION,
      variables: {
        codigo: recursoData.codigo,
        nombre: recursoData.nombre,
        descripcion: recursoData.descripcion,
        cantidad: recursoData.cantidad,
        unidad_id: recursoData.unidad_id,
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

export const updateRecursoService = async (recursoData: UpdateRecursoInput) => {
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