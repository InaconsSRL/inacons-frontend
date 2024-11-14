
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACIONES = gql`
  query ListCotizaciones {
    listCotizaciones {
      id
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
      }
      usuario_id {
        nombres
        apellidos
        id
      }
      solicitud_compra_id {
        id
        requerimiento_id {
          id
          usuario_id
          usuario
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
        }
        fecha
        usuario_id {
          nombres
          apellidos
          id
        }
      }
      aprobacion
    }
  }
`;

const GET_COTIZACION = gql`
  query GetCotizacion($getCotizacionId: ID!) {
    getCotizacion(id: $getCotizacionId) {
      id
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
      }
      usuario_id {
        nombres
        apellidos
        id
      }
      solicitud_compra_id {
        id
        requerimiento_id {
          id
          usuario_id
          usuario
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
        }
        fecha
        usuario_id {
          nombres
          apellidos
          id
        }
      }
      aprobacion
    }
  }
`;

const ADD_COTIZACION = gql`
  mutation AddCotizacion($codigoCotizacion: String!, $proveedorId: ID!, $usuarioId: ID!, $solicitudCompraId: ID!, $aprobacion: Boolean) {
    addCotizacion(codigo_cotizacion: $codigoCotizacion, proveedor_id: $proveedorId, usuario_id: $usuarioId, solicitud_compra_id: $solicitudCompraId, aprobacion: $aprobacion) {
     id
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
      }
      usuario_id {
        nombres
        apellidos
        id
      }
      solicitud_compra_id {
        id
        requerimiento_id {
          id
          usuario_id
          usuario
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
        }
        fecha
        usuario_id {
          nombres
          apellidos
          id
        }
      }
      aprobacion
    }
  }
`;

const UPDATE_COTIZACION = gql`
  mutation UpdateCotizacion($updateCotizacionId: ID!, $codigoCotizacion: String!, $proveedorId: ID!, $usuarioId: ID!, $solicitudCompraId: ID!, $aprobacion: Boolean) {
    updateCotizacion(id: $updateCotizacionId, codigo_cotizacion: $codigoCotizacion, proveedor_id: $proveedorId, usuario_id: $usuarioId, solicitud_compra_id: $solicitudCompraId, aprobacion: $aprobacion) {
      id
      codigo_cotizacion
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
      }
      usuario_id {
        nombres
        apellidos
        id
      }
      solicitud_compra_id {
        id
        requerimiento_id {
          id
          usuario_id
          usuario
          presupuesto_id
          fecha_solicitud
          fecha_final
          estado_atencion
          sustento
          obra_id
          codigo
        }
        fecha
        usuario_id {
          nombres
          apellidos
          id
        }
      }
      aprobacion
    }
  }
`;

const DELETE_COTIZACION = gql`
  mutation DeleteCotizacion($deleteCotizacionId: ID!) {
    deleteCotizacion(id: $deleteCotizacionId) {
      id
    }
  }
`;

export const listCotizacionesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_COTIZACIONES,
    });
    return data.listCotizaciones;
  } catch (error) {
    throw new Error(`Error fetching cotizaciones: ${error}`);
  }
};

export const getCotizacionService = async (id: string) => {
  try {
    const { data } = await client.query({
      query: GET_COTIZACION,
      variables: { getCotizacionId: id },
    });
    return data.getCotizacion;
  } catch (error) {
    throw new Error(`Error fetching cotizacion: ${error}`);
  }
};

export const addCotizacionService = async (cotizacionData: {
  codigo_cotizacion: string;
  proveedor_id: string;
  usuario_id: string;
  solicitud_compra_id: string;
  aprobacion: boolean;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_COTIZACION,
      variables: {
        codigoCotizacion: cotizacionData.codigo_cotizacion,
        proveedorId: cotizacionData.proveedor_id,
        usuarioId: cotizacionData.usuario_id,
        solicitudCompraId: cotizacionData.solicitud_compra_id,
        aprobacion: cotizacionData.aprobacion,
      },
    });
    return data.addCotizacion;
  } catch (error) {
    throw new Error(`Error adding cotizacion: ${error}`);
  }
};

export const updateCotizacionService = async (cotizacionData: {
  id: string;
  codigo_cotizacion: string;
  proveedor_id: string;
  usuario_id: string;
  solicitud_compra_id: string;
  aprobacion: boolean;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_COTIZACION,
      variables: {
        updateCotizacionId: cotizacionData.id,
        codigoCotizacion: cotizacionData.codigo_cotizacion,
        proveedorId: cotizacionData.proveedor_id,
        usuarioId: cotizacionData.usuario_id,
        solicitudCompraId: cotizacionData.solicitud_compra_id,
        aprobacion: cotizacionData.aprobacion,
      },
    });
    return data.updateCotizacion;
  } catch (error) {
    throw new Error(`Error updating cotizacion: ${error}`);
  }
};

export const deleteCotizacionService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_COTIZACION,
      variables: { deleteCotizacionId: id },
    });
    return data.deleteCotizacion;
  } catch (error) {
    throw new Error(`Error deleting cotizacion: ${error}`);
  }
};