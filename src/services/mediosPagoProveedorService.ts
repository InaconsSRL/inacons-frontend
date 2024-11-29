import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_MEDIOS_PAGO_QUERY = gql`
  query ListMediosPagoProveedores {
    listMediosPagoProveedores {
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
      cuenta_bcp
      cuenta_bbva
      yape
    }
  }
`;

const GET_MEDIOS_PAGO_BY_PROVEEDOR_QUERY = gql`
  query ListMediosPagoProveedorByProveedor($proveedor_id: ID!) {
    listMediosPagoProveedorByProveedor(proveedor_id: $proveedor_id) {
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
      cuenta_bcp
      cuenta_bbva
      yape
    }
  }
`;

const ADD_MEDIOS_PAGO_MUTATION = gql`
  mutation AddMediosPagoProveedor($proveedor_id: ID!, $cuenta_bcp: String, $cuenta_bbva: String, $yape: String) {
    addMediosPagoProveedor(proveedor_id: $proveedor_id, cuenta_bcp: $cuenta_bcp, cuenta_bbva: $cuenta_bbva, yape: $yape) {
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
      cuenta_bcp
      cuenta_bbva
      yape
    }
  }
`;

const UPDATE_MEDIOS_PAGO_MUTATION = gql`
  mutation UpdateMediosPagoProveedor($updateMediosPagoproveedor_id: ID!, $proveedor_id: ID, $cuenta_bcp: String, $cuenta_bbva: String, $yape: String) {
    updateMediosPagoProveedor(id: $updateMediosPagoproveedor_id, proveedor_id: $proveedor_id, cuenta_bcp: $cuenta_bcp, cuenta_bbva: $cuenta_bbva, yape: $yape) {
      id
      cuenta_bcp
      cuenta_bbva
      yape
    }
  }
`;

const DELETE_MEDIOS_PAGO_MUTATION = gql`
  mutation DeleteMediosPagoProveedor($deleteMediosPagoproveedor_id: ID!) {
    deleteMediosPagoProveedor(id: $deleteMediosPagoproveedor_id) {
      id
    }
  }
`;

export const listMediosPagoProveedoresService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_MEDIOS_PAGO_QUERY,
    });
    return data.listMediosPagoProveedores;
  } catch (error) {
    throw new Error(`Error fetching medios de pago: ${error}`);
  }
};

export const getMediosPagoByProveedorService = async (proveedor_id: string) => {
  try {
    const { data } = await client.query({
      query: GET_MEDIOS_PAGO_BY_PROVEEDOR_QUERY,
      variables: { proveedor_id },
    });
    return data.listMediosPagoProveedorByProveedor;
  } catch (error) {
    throw new Error(`Error fetching medios de pago by proveedor: ${error}`);
  }
};

export const addMediosPagoProveedorService = async (mediosPagoData: {
  proveedor_id: string;
  cuenta_bcp?: string;
  cuenta_bbva?: string;
  yape?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_MEDIOS_PAGO_MUTATION,
      variables: mediosPagoData,
    });
    return data.addMediosPagoProveedor;
  } catch (error) {
    throw new Error(`Error adding medios de pago: ${error}`);
  }
};

export const updateMediosPagoProveedorService = async (mediosPagoData: {
  id: string;
  proveedor_id?: string;
  cuenta_bcp?: string;
  cuenta_bbva?: string;
  yape?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_MEDIOS_PAGO_MUTATION,
      variables: {
        updateMediosPagoproveedor_id: mediosPagoData.id,
        ...mediosPagoData,
      },
    });
    return data.updateMediosPagoProveedor;
  } catch (error) {
    throw new Error(`Error updating medios de pago: ${error}`);
  }
};

export const deleteMediosPagoProveedorService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_MEDIOS_PAGO_MUTATION,
      variables: { deleteMediosPagoproveedor_id: id },
    });
    return data.deleteMediosPagoProveedor;
  } catch (error) {
    throw new Error(`Error deleting medios de pago: ${error}`);
  }
};