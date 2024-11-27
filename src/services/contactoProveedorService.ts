import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_CONTACTOS_PROVEEDOR = gql`
  query list_contactos_proveedor {
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
  query list_contactos_by_proveedor($proveedor_id: ID!) {
    listContactosByProveedor(proveedor_id: $proveedor_id) {
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
  mutation add_contacto_proveedor($proveedor_id: ID!, $nombres: String!, $apellidos: String!, $cargo: String!, $telefono: String!) {
    addContactoProveedor(proveedor_id: $proveedor_id, nombres: $nombres, apellidos: $apellidos, cargo: $cargo, telefono: $telefono) {
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

const UPDATE_CONTACTO_PROVEEDOR = gql`
  mutation update_contacto_proveedor($id: ID!, $proveedor_id: ID, $nombres: String, $apellidos: String, $cargo: String, $telefono: String) {
    updateContactoProveedor(id: $id, proveedor_id: $proveedor_id, nombres: $nombres, apellidos: $apellidos, cargo: $cargo, telefono: $telefono) {
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

const DELETE_CONTACTO_PROVEEDOR = gql`
  mutation delete_contacto_proveedor($id: ID!) {
    deleteContactoProveedor(id: $id) {
      id
    }
  }
`;

export const listContactosProveedorService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_CONTACTOS_PROVEEDOR,
    });
    return data.list_contactos_proveedor;
  } catch (error) {
    throw new Error(`Error fetching contactos proveedor: ${error}`);
  }
};

export const listContactosByProveedorService = async (proveedorId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_CONTACTOS_BY_PROVEEDOR,
      variables: { proveedor_id: proveedorId },
    });
    return data.list_contactos_by_proveedor;
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
      variables: {
        proveedor_id: contactoData.proveedor_id,
        nombres: contactoData.nombres,
        apellidos: contactoData.apellidos,
        cargo: contactoData.cargo,
        telefono: contactoData.telefono,
      },
    });
    return data.add_contacto_proveedor;
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
        id: contactoData.id,
        proveedor_id: contactoData.proveedor_id,
        nombres: contactoData.nombres,
        apellidos: contactoData.apellidos,
        cargo: contactoData.cargo,
        telefono: contactoData.telefono,
      },
    });
    return data.update_contacto_proveedor;
  } catch (error) {
    throw new Error(`Error updating contacto proveedor: ${error}`);
  }
};

export const deleteContactoProveedorService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_CONTACTO_PROVEEDOR,
      variables: { id },
    });
    return data.delete_contacto_proveedor;
  } catch (error) {
    throw new Error(`Error deleting contacto proveedor: ${error}`);
  }
};