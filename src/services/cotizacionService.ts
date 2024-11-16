import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACIONES_QUERY = gql`
  query ListCotizaciones {
    listCotizaciones {
      id
      aprobacion
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        ruc
        direccion
        nombre_comercial
      }
      solicitud_compra_id {
        id
        fecha
        requerimiento_id {
          id
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
          usuario_id
          usuario
        }
        usuario_id {
          id
          nombres
          apellidos
        }
      }
      usuario_id {
        id
        nombres
        apellidos
      }
    }
  }
`;

const GET_COTIZACION_QUERY = gql`
  query GetCotizacion($getCotizacionId: ID!) {
    getCotizacion(id: $getCotizacionId) {
      id
      aprobacion
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        ruc
        direccion
        nombre_comercial
      }
      solicitud_compra_id {
        id
        fecha
        requerimiento_id {
          id
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
          usuario_id
          usuario
        }
        usuario_id {
          id
          nombres
          apellidos
        }
      }
      usuario_id {
        id
        nombres
        apellidos
      }
    }
  }
`;

const ADD_COTIZACION_MUTATION = gql`
  mutation AddCotizacion($codigoCotizacion: String!, $proveedorId: ID!, $usuarioId: ID!, $solicitudCompraId: ID!, $aprobacion: Boolean) {
    addCotizacion(codigo_cotizacion: $codigoCotizacion, proveedor_id: $proveedorId, usuario_id: $usuarioId, solicitud_compra_id: $solicitudCompraId, aprobacion: $aprobacion) {
      id
      aprobacion
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        ruc
        direccion
        nombre_comercial
      }
      solicitud_compra_id {
        id
        fecha
        requerimiento_id {
          id
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
          usuario_id
          usuario
        }
        usuario_id {
          id
          nombres
          apellidos
        }
      }
      usuario_id {
        id
        nombres
        apellidos
      }
    }
  }
`;

const UPDATE_COTIZACION_MUTATION = gql`
  mutation UpdateCotizacion($updateCotizacionId: ID!, $codigoCotizacion: String!, $proveedorId: ID!, $usuarioId: ID!, $solicitudCompraId: ID!, $aprobacion: Boolean) {
    updateCotizacion(id: $updateCotizacionId, codigo_cotizacion: $codigoCotizacion, proveedor_id: $proveedorId, usuario_id: $usuarioId, solicitud_compra_id: $solicitudCompraId, aprobacion: $aprobacion) {
      id
      aprobacion
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        ruc
        direccion
        nombre_comercial
      }
      solicitud_compra_id {
        id
        fecha
        requerimiento_id {
          id
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
          usuario_id
          usuario
        }
        usuario_id {
          id
          nombres
          apellidos
        }
      }
      usuario_id {
        id
        nombres
        apellidos
      }
    }
  }
`;

const DELETE_COTIZACION_MUTATION = gql`
  mutation DeleteCotizacion($deleteCotizacionId: ID!) {
    deleteCotizacion(id: $deleteCotizacionId) {
      id
    }
  }
`;

// Funciones de servicio
export const listCotizacionesService = async () => {
  try {
    const response = await client.query({
      query: LIST_COTIZACIONES_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listCotizaciones;
  } catch (error) {
    console.error('Error al obtener la lista de cotizaciones:', error);
    throw error;
  }
};

export const getCotizacionService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COTIZACION_QUERY,
      variables: { getCotizacionId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getCotizacion;
  } catch (error) {
    console.error('Error al obtener la cotización:', error);
    throw error;
  }
};

export const addCotizacionService = async (cotizacionData: { codigo_cotizacion: string; proveedor_id: string; usuario_id: string; solicitud_compra_id: string; aprobacion: boolean }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_COTIZACION_MUTATION,
      variables: cotizacionData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addCotizacion;
  } catch (error) {
    console.error('Error al agregar la cotización:', error);
    throw error;
  }
};

export const updateCotizacionService = async (cotizacion: { id: string; codigo_cotizacion: string; proveedor_id: string; usuario_id: string; solicitud_compra_id: string; aprobacion: boolean }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_COTIZACION_MUTATION,
      variables: { updateCotizacionId: cotizacion.id, ...cotizacion },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateCotizacion;
  } catch (error) {
    console.error('Error al actualizar la cotización:', error);
    throw error;
  }
};

export const deleteCotizacionService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COTIZACION_MUTATION,
      variables: { deleteCotizacionId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteCotizacion;
  } catch (error) {
    console.error('Error al eliminar la cotización:', error);
    throw error;
  }
};