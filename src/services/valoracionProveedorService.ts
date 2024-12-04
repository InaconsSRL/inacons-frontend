import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_VALORACION_PROVEEDORES = gql`
  query ListValoracionProveedores {
    listValoracionProveedores {
      id
      proveedor_id {
        id
      }
      puntuacion
      fecha_inicio
      fecha_fin
    }
  }
`;

const LIST_VALORACION_BY_PROVEEDOR = gql`
  query ListValoracionProveedoresByProveedor($proveedor_id: ID!) {
    listValoracionProveedoresByProveedor(proveedor_id: $proveedor_id) {
      id
      proveedor_id {
        id
      }
      puntuacion
      fecha_inicio
      fecha_fin
    }
  }
`;

const ADD_VALORACION_PROVEEDOR = gql`
  mutation AddValoracionProveedor($proveedor_id: ID!, $puntuacion: Int!, $fecha_inicio: Date!, $fecha_fin: Date!) {
    addValoracionProveedor(proveedor_id: $proveedor_id, puntuacion: $puntuacion, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin) {
      id
      proveedor_id {
        id
      }
      puntuacion
      fecha_inicio
      fecha_fin
    }
  }
`;

const UPDATE_VALORACION_PROVEEDOR = gql`
  mutation UpdateValoracionProveedor($updateValoracionProveedorId: ID!, $proveedor_id: ID, $puntuacion: Int, $fecha_inicio: Date, $fecha_fin: Date) {
    updateValoracionProveedor(id: $updateValoracionProveedorId, proveedor_id: $proveedor_id, puntuacion: $puntuacion, fecha_inicio: $fecha_inicio, fecha_fin: $fecha_fin) {
      id
      proveedor_id {
        id
      }
      puntuacion
      fecha_inicio
      fecha_fin
    }
  }
`;

const DELETE_VALORACION_PROVEEDOR = gql`
  mutation DeleteValoracionProveedor($deleteValoracionProveedorId: ID!) {
    deleteValoracionProveedor(id: $deleteValoracionProveedorId) {
      id
    }
  }
`;

export const listValoracionProveedoresService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_VALORACION_PROVEEDORES,
    });
    return data.listValoracionProveedores;
  } catch (error) {
    throw new Error(`Error fetching valoraciones: ${error}`);
  }
};

export const listValoracionByProveedorService = async (proveedorId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_VALORACION_BY_PROVEEDOR,
      variables: { proveedor_id: proveedorId },
    });
    return data.listValoracionProveedoresByProveedor;
  } catch (error) {
    throw new Error(`Error fetching valoraciones by proveedor: ${error}`);
  }
};

export const addValoracionProveedorService = async (valoracionData: { 
  proveedor_id: string; 
  puntuacion: number; 
  fecha_inicio: Date; 
  fecha_fin: Date;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_VALORACION_PROVEEDOR,
      variables: valoracionData,
    });
    return data.addValoracionProveedor;
  } catch (error) {
    throw new Error(`Error adding valoracion: ${error}`);
  }
};

export const updateValoracionProveedorService = async (valoracionData: {
  id: string;
  proveedor_id?: string;
  puntuacion?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_VALORACION_PROVEEDOR,
      variables: {
        updateValoracionProveedorId: valoracionData.id,
        ...valoracionData,
      },
    });
    return data.updateValoracionProveedor;
  } catch (error) {
    throw new Error(`Error updating valoracion: ${error}`);
  }
};

export const deleteValoracionProveedorService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_VALORACION_PROVEEDOR,
      variables: { deleteValoracionProveedorId: id },
    });
    return data.deleteValoracionProveedor;
  } catch (error) {
    throw new Error(`Error deleting valoracion: ${error}`);
  }
};