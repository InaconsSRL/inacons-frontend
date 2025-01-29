import { gql } from '@apollo/client';
import client from '../apolloClient';
import { Infraestructura } from '../slices/infraestructuraSlice';

const LIST_INFRAESTRUCTURAS_QUERY = gql`
  query ListInfraestructuras {
    listInfraestructuras {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const GET_INFRAESTRUCTURA_QUERY = gql`
  query GetInfraestructura($id_infraestructura: String!) {
    getInfraestructura(id_infraestructura: $id_infraestructura) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const ADD_INFRAESTRUCTURA_MUTATION = gql`
  mutation AddInfraestructura($nombre_infraestructura: String!, $tipo_infraestructura: String!, $descripcion: String!) {
    addInfraestructura(nombre_infraestructura: $nombre_infraestructura, tipo_infraestructura: $tipo_infraestructura, descripcion: $descripcion) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const UPDATE_INFRAESTRUCTURA_MUTATION = gql`
  mutation UpdateInfraestructura($id_infraestructura: String!, $descripcion: String, $tipo_infraestructura: String, $nombre_infraestructura: String) {
    updateInfraestructura(id_infraestructura: $id_infraestructura, descripcion: $descripcion, tipo_infraestructura: $tipo_infraestructura, nombre_infraestructura: $nombre_infraestructura) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const DELETE_INFRAESTRUCTURA_MUTATION = gql`
  mutation DeleteInfraestructura($id_infraestructura: String!) {
    deleteInfraestructura(id_infraestructura: $id_infraestructura) {
      id_infraestructura
    }
  }
`;

export const listInfraestructurasService = async () => {
  try {
    const response = await client.query({
      query: LIST_INFRAESTRUCTURAS_QUERY,
    });
    return response.data.listInfraestructuras;
  } catch (error) {
    throw new Error(`Error fetching infraestructuras: ${error}`);
  }
};

export const getInfraestructuraService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_INFRAESTRUCTURA_QUERY,
      variables: { id_infraestructura: id },
    });
    return response.data.getInfraestructura;
  } catch (error) {
    throw new Error(`Error fetching infraestructura: ${error}`);
  }
};

export const addInfraestructuraService = async (data: Omit<Infraestructura, 'id_infraestructura'>) => {
  try {
    const response = await client.mutate({
      mutation: ADD_INFRAESTRUCTURA_MUTATION,
      variables: data,
    });
    return response.data.addInfraestructura;
  } catch (error) {
    throw new Error(`Error adding infraestructura: ${error}`);
  }
};

export const updateInfraestructuraService = async (data: Partial<Infraestructura> & { id_infraestructura: string }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_INFRAESTRUCTURA_MUTATION,
      variables: data,
    });
    return response.data.updateInfraestructura;
  } catch (error) {
    throw new Error(`Error updating infraestructura: ${error}`);
  }
};

export const deleteInfraestructuraService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_INFRAESTRUCTURA_MUTATION,
      variables: { id_infraestructura: id },
    });
    return response.data.deleteInfraestructura;
  } catch (error) {
    throw new Error(`Error deleting infraestructura: ${error}`);
  }
};
