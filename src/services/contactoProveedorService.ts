import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CONTACTOS_PROVEEDOR = gql`
  query ListContactosProveedor {
    listContactosProveedor {
      id
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
        rubro
        estado
      }
      nombres
      apellidos
      cargo
      telefono
    }
  }
`;

const LIST_CONTACTOS_BY_PROVEEDOR = gql`
  query ListContactosByProveedor($proveedorId: ID!) {
    listContactosByProveedor(proveedor_id: $proveedorId) {
      id
      proveedor_id {
        id
        razon_social
        direccion
        nombre_comercial
        ruc
        rubro
        estado
      }
      nombres
      apellidos
      cargo
      telefono
    }
  }
`;

const ADD_CONTACTO_PROVEEDOR = gql`
  mutation AddContactoProveedor($proveedor_id: ID!, $nombres: String!, $apellidos: String!, $cargo: String!, $telefono: String!) {
    addContactoProveedor(proveedor_id: $proveedor_id, nombres: $nombres, apellidos: $apellidos, cargo: $cargo, telefono: $telefono) {
      id
      proveedor_id {
        id
        razon_social
      }
      nombres
      apellidos
      cargo
      telefono
    }
  }
`;

const UPDATE_CONTACTO_PROVEEDOR = gql`
  mutation UpdateContactoProveedor($updateContactoProveedorId: ID!, $proveedor_id: ID, $nombres: String, $apellidos: String, $cargo: String, $telefono: String) {
    updateContactoProveedor(id: $updateContactoProveedorId, proveedor_id: $proveedor_id, nombres: $nombres, apellidos: $apellidos, cargo: $cargo, telefono: $telefono) {
      id
      proveedor_id {
        id
        razon_social
      }
      nombres
      apellidos
      cargo
      telefono
    }
  }
`;

const DELETE_CONTACTO_PROVEEDOR = gql`
  mutation DeleteContactoProveedor($deleteContactoProveedorId: ID!) {
    deleteContactoProveedor(id: $deleteContactoProveedorId) {
      id
    }
  }
`;

export const listContactosProveedorService = async () => {
  try {
    const { data } = await client.query({ query: LIST_CONTACTOS_PROVEEDOR });
    return data.listContactosProveedor;
  } catch (error) {
    throw new Error(`Error fetching contactos proveedor: ${error}`);
  }
};

export const listContactosByProveedorService = async (proveedorId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_CONTACTOS_BY_PROVEEDOR,
      variables: { proveedorId }
    });
    return data.listContactosByProveedor;
  } catch (error) {
    throw new Error(`Error fetching contactos by proveedor: ${error}`);
  }
};

export const addContactoProveedorService = async (contactoData: {
  proveedor_id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_CONTACTO_PROVEEDOR,
      variables: contactoData
    });
    return data.addContactoProveedor;
  } catch (error) {
    throw new Error(`Error adding contacto proveedor: ${error}`);
  }
};

export const updateContactoProveedorService = async (contactoData: {
  id: string;
  proveedor_id?: string;
  nombres?: string;
  apellidos?: string;
  cargo?: string;
  telefono?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CONTACTO_PROVEEDOR,
      variables: {
        updateContactoProveedorId: contactoData.id,
        ...contactoData
      }
    });
    return data.updateContactoProveedor;
  } catch (error) {
    throw new Error(`Error updating contacto proveedor: ${error}`);
  }
};

export const deleteContactoProveedorService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_CONTACTO_PROVEEDOR,
      variables: { deleteContactoProveedorId: id }
    });
    return data.deleteContactoProveedor;
  } catch (error) {
    throw new Error(`Error deleting contacto proveedor: ${error}`);
  }
};
