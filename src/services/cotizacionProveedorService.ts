import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACION_PROVEEDORES = gql`
  query ListCotizacionProveedores {
    listCotizacionProveedores {
      id
      cotizacion_id {
        id
      }
      proveedor_id {
        id
        ruc
        razon_social
        nombre_comercial
      }
      estado
      fecha_inicio
      fecha_fin
      entrega
      c_pago
      observaciones
    }
  }
`;

const LIST_COTIZACION_PROVEEDORES_BY_COTIZACION_ID = gql`
  query ListCotizacionProveedoresByCotizacionId($cotizacionId: ID!) {
    listCotizacionProveedoresByCotizacionId(cotizacion_id: $cotizacionId) {
      id
      cotizacion_id {
        id
      }
      proveedor_id {
        id
        ruc
        razon_social
        nombre_comercial
      }
      estado
      fecha_inicio
      fecha_fin
      entrega
      c_pago
      observaciones
    }
  }
`;

const ADD_COTIZACION_PROVEEDOR = gql`
  mutation AddCotizacionProveedor($cotizacionId: ID!, $proveedor_id: ID!, $estado: String, $fecha_inicio: DateTime, $fecha_fin: DateTime, $entrega: DateTime, $c_pago: String, $observaciones: String) {
    addCotizacionProveedor(cotizacion_id: $cotizacionId, proveedor_id: $proveedor_id, estado: $estado, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin, entrega: $entrega, c_pago: $c_pago, observaciones: $observaciones) {
      id
      cotizacion_id {
        id
      }
      proveedor_id {
        id
        ruc
        razon_social
        nombre_comercial
      }
      estado
      fecha_inicio
      fecha_fin
      entrega
      c_pago
      observaciones
    }
  }
`;

const UPDATE_COTIZACION_PROVEEDOR = gql`
  mutation UpdateCotizacionProveedor($updateCotizacionProveedorId: ID!, $cotizacion_id: ID, $proveedor_id: ID, $estado: String, $fecha_inicio: DateTime, $fecha_fin: DateTime, $entrega: DateTime, $c_pago: String, $observaciones: String) {
    updateCotizacionProveedor(id: $updateCotizacionProveedorId, cotizacion_id: $cotizacion_id, proveedor_id: $proveedor_id, estado: $estado, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin, entrega: $entrega, c_pago: $c_pago, observaciones: $observaciones) {
      id
      cotizacion_id {
        id
      }
      proveedor_id {
        id
        ruc
        razon_social
        nombre_comercial
      }
      estado
      fecha_inicio
      fecha_fin
      entrega
      c_pago
      observaciones
    }
  }
`;

const DELETE_COTIZACION_PROVEEDOR = gql`
  mutation DeleteCotizacionProveedor($deleteCotizacionProveedorId: ID!) {
    deleteCotizacionProveedor(id: $deleteCotizacionProveedorId) {
      id
    }
  }
`;

export const listCotizacionProveedores = async () => {
  try {
    const { data } = await client.query({
      query: LIST_COTIZACION_PROVEEDORES,
    });
    return data.listCotizacionProveedores;
  } catch (error) {
    throw new Error(`Error fetching cotizacion proveedores: ${error}`);
  }
};

export const listCotizacionProveedoresByCotizacionId = async (cotizacionId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_COTIZACION_PROVEEDORES_BY_COTIZACION_ID,
      variables: { cotizacionId },
    });
    return data.listCotizacionProveedoresByCotizacionId;
  } catch (error) {
    throw new Error(`Error fetching cotizacion proveedores by cotizacion id: ${error}`);
  }
};

interface CotizacionProveedorData {
  cotizacionId: string;
  proveedor_id: string;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  entrega?: string;
  c_pago?: string;
  observaciones?: string;
}

export const addCotizacionProveedor = async (cotizacionProveedorData: CotizacionProveedorData) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_COTIZACION_PROVEEDOR,
      variables: cotizacionProveedorData,
    });
    return data.addCotizacionProveedor;
  } catch (error) {
    throw new Error(`Error adding cotizacion proveedor: ${error}`);
  }
};

interface UpdateCotizacionProveedorData {
  id: string;
  cotizacion_id?: string;
  proveedor_id?: string;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  entrega?: string;
  c_pago?: string;
  observaciones?: string;
}

export const updateCotizacionProveedor = async (cotizacionProveedorData: UpdateCotizacionProveedorData) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_COTIZACION_PROVEEDOR,
      variables: {
        updateCotizacionProveedorId: cotizacionProveedorData.id,
        ...cotizacionProveedorData,
      },
    });
    return data.updateCotizacionProveedor;
  } catch (error) {
    throw new Error(`Error updating cotizacion proveedor: ${error}`);
  }
};

export const deleteCotizacionProveedor = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_COTIZACION_PROVEEDOR,
      variables: { deleteCotizacionProveedorId: id },
    });
    return data.deleteCotizacionProveedor;
  } catch (error) {
    throw new Error(`Error deleting cotizacion proveedor: ${error}`);
  }
};
