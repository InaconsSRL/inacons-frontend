import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACION_RECURSO_QUERY = gql`
  query ListCotizacionRecurso {
    listCotizacionRecurso {
      id
      cantidad
      atencion
      costo
      total
      cotizacion_id {
        codigo_cotizacion
        aprobacion
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        precio_actual
        vigente
        unidad_id
        imagenes {
          file
        }
      }
    }
  }
`;

const GET_COTIZACION_RECURSO_QUERY = gql`
  query GetCotizacionRecurso($getCotizacionRecursoId: ID!) {
    getCotizacionRecurso(id: $getCotizacionRecursoId) {
      id
      cantidad
      atencion
      costo
      total
      cotizacion_id {
        codigo_cotizacion
        aprobacion
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        precio_actual
        vigente
        unidad_id
        imagenes {
          file
        }
      }
    }
  }
`;

const GET_COTIZACION_RECURSO_FOR_COTIZACION_ID_QUERY = gql`
  query GetCotizacionRecursoforCotizacionId($getCotizacionRecursoforCotizacionIdId: ID!) {
    getCotizacionRecursoforCotizacionId(id: $getCotizacionRecursoforCotizacionIdId) {
      id
      cantidad
      atencion
      costo
      total
      cotizacion_id {
        codigo_cotizacion
        aprobacion
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        precio_actual
        vigente
        unidad_id
        imagenes {
          file
        }
      }
    }
  }
`;

const ADD_COTIZACION_RECURSO_MUTATION = gql`
  mutation AddCotizacionRecurso($cotizacionId: ID!, $recursoId: ID!, $cantidad: Int!, $atencion: String!, $costo: Float!) {
    addCotizacionRecurso(cotizacion_id: $cotizacionId, recurso_id: $recursoId, cantidad: $cantidad, atencion: $atencion, costo: $costo) {
      id
      cantidad
      atencion
      costo
      total
      cotizacion_id {
        codigo_cotizacion
        aprobacion
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        precio_actual
        vigente
        unidad_id
        imagenes {
          file
        }
      }
    }
  }
`;

const UPDATE_COTIZACION_RECURSO_MUTATION = gql`
  mutation UpdateCotizacionRecurso($updateCotizacionRecursoId: ID!, $cotizacionId: ID!, $recursoId: ID!, $cantidad: Int!, $atencion: String!, $costo: Float!) {
    updateCotizacionRecurso(id: $updateCotizacionRecursoId, cotizacion_id: $cotizacionId, recurso_id: $recursoId, cantidad: $cantidad, atencion: $atencion, costo: $costo) {
      id
      cantidad
      atencion
      costo
      total
      cotizacion_id {
        codigo_cotizacion
        aprobacion
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        fecha
        cantidad
        precio_actual
        vigente
        unidad_id
        imagenes {
          file
        }
      }
    }
  }
`;

const DELETE_COTIZACION_RECURSO_MUTATION = gql`
  mutation DeleteCotizacionRecurso($deleteCotizacionRecursoId: ID!) {
    deleteCotizacionRecurso(id: $deleteCotizacionRecursoId) {
      id
    }
  }
`;

export const listCotizacionRecursoService = async () => {
  try {
    const response = await client.query({
      query: LIST_COTIZACION_RECURSO_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listCotizacionRecurso;
  } catch (error) {
    console.error('Error al obtener la lista de cotizaciones recurso:', error);
    throw error;
  }
};

export const getCotizacionRecursoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COTIZACION_RECURSO_QUERY,
      variables: { getCotizacionRecursoId: id }
    });

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }

    return response.data.getCotizacionRecurso;
  } catch (error) {
    console.error('Error al obtener la cotización recurso:', error);
    throw error;
  }
};

export const getCotizacionRecursoForCotizacionIdService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COTIZACION_RECURSO_FOR_COTIZACION_ID_QUERY,
      variables: { getCotizacionRecursoforCotizacionIdId: id }
    });

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }

    return response.data.getCotizacionRecursoforCotizacionId;
  } catch (error) {
    console.error('Error al obtener la cotización recurso por ID de cotización:', error);
    throw error;
  }
};

export const addCotizacionRecursoService = async (data: { cotizacion_id: string; recurso_id: string; cantidad: number; atencion: string; costo: number }) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: ADD_COTIZACION_RECURSO_MUTATION,
      variables: {
        cotizacionId: data.cotizacion_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        atencion: data.atencion,
        costo: data.costo,
      },
    });
    return responseData.addCotizacionRecurso;
  } catch (error) {
    throw new Error(`Error adding cotización recurso ${error}`);
  }
};

export const updateCotizacionRecursoService = async (data: { id: string; cotizacion_id: string; recurso_id: string; cantidad: number; atencion: string; costo: number }) => {
  try {
    const { data: responseData } = await client.mutate({
      mutation: UPDATE_COTIZACION_RECURSO_MUTATION,
      variables: {
        updateCotizacionRecursoId: data.id,
        cotizacionId: data.cotizacion_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        atencion: data.atencion,
        costo: data.costo,
      },
    });
    return responseData.updateCotizacionRecurso;
  } catch (error) {
    throw new Error(`Error updating cotización recurso ${error}`);
  }
};

export const deleteCotizacionRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COTIZACION_RECURSO_MUTATION,
      variables: { deleteCotizacionRecursoId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    // Retornamos directamente el ID que eliminamos
    return id;
  } catch (error) {
    console.error('Error al eliminar la cotización recurso:', error);
    throw error;
  }
};