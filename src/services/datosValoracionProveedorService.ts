import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_DATOS_VALORACION_PROVEEDORES = gql`
  query ListDatosValoracionProveedores {
    listDatosValoracionProveedores {
      id
      cuestionario_id {
        id
        denominacion
      }
      id_proveedor {
        id
      }
      respuesta
    }
  }
`;

const LIST_DATOS_VALORACION_BY_PROVEEDOR = gql`
  query ListDatosValoracionProveedoresByProveedor($id_proveedor: ID!) {
    listDatosValoracionProveedoresByProveedor(id_proveedor: $id_proveedor) {
      id
      cuestionario_id {
        id
        denominacion
      }
      id_proveedor {
        id
      }
      respuesta
    }
  }
`;

const ADD_DATOS_VALORACION_PROVEEDOR = gql`
  mutation AddDatosValoracionProveedor($cuestionario_id: ID!, $id_proveedor: ID!, $respuesta: String!) {
    addDatosValoracionProveedor(cuestionario_id: $cuestionario_id, id_proveedor: $id_proveedor, respuesta: $respuesta) {
      id
      cuestionario_id {
        id
        denominacion
      }
      id_proveedor {
        id
      }
      respuesta
    }
  }
`;

const UPDATE_DATOS_VALORACION_PROVEEDOR = gql`
  mutation UpdateDatosValoracionProveedor($updateDatosValoracionProveedorId: ID!, $cuestionario_id: ID, $id_proveedor: ID, $respuesta: String) {
    updateDatosValoracionProveedor(id: $updateDatosValoracionProveedorId, cuestionario_id: $cuestionario_id, id_proveedor: $id_proveedor, respuesta: $respuesta) {
      id
      cuestionario_id {
        id
        denominacion
      }
      id_proveedor {
        id
      }
      respuesta
    }
  }
`;

const DELETE_DATOS_VALORACION_PROVEEDOR = gql`
  mutation DeleteDatosValoracionProveedor($deleteDatosValoracionProveedorId: ID!) {
    deleteDatosValoracionProveedor(id: $deleteDatosValoracionProveedorId) {
      id
    }
  }
`;

export const listDatosValoracionProveedoresService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_DATOS_VALORACION_PROVEEDORES,
    });
    return data.listDatosValoracionProveedores;
  } catch (error) {
    throw new Error(`Error fetching datos valoracion proveedores: ${error}`);
  }
};

export const listDatosValoracionByProveedorService = async (id_proveedor: string) => {
  try {
    const { data } = await client.query({
      query: LIST_DATOS_VALORACION_BY_PROVEEDOR,
      variables: { id_proveedor },
    });
    return data.listDatosValoracionProveedoresByProveedor;
  } catch (error) {
    throw new Error(`Error fetching datos valoracion by proveedor: ${error}`);
  }
};

export const addDatosValoracionProveedorService = async (datos: { 
  cuestionario_id: string;
  id_proveedor: string;
  respuesta: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_DATOS_VALORACION_PROVEEDOR,
      variables: datos,
    });
    return data.addDatosValoracionProveedor;
  } catch (error) {
    throw new Error(`Error adding datos valoracion proveedor: ${error}`);
  }
};

export const updateDatosValoracionProveedorService = async (datos: {
  id: string;
  cuestionario_id?: string;
  id_proveedor?: string;
  respuesta?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_DATOS_VALORACION_PROVEEDOR,
      variables: {
        updateDatosValoracionProveedorId: datos.id,
        ...datos
      },
    });
    return data.updateDatosValoracionProveedor;
  } catch (error) {
    throw new Error(`Error updating datos valoracion proveedor: ${error}`);
  }
};

export const deleteDatosValoracionProveedorService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_DATOS_VALORACION_PROVEEDOR,
      variables: { deleteDatosValoracionProveedorId: id },
    });
    return data.deleteDatosValoracionProveedor;
  } catch (error) {
    throw new Error(`Error deleting datos valoracion proveedor: ${error}`);
  }
};