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
  query GetInfraestructura($idInfraestructura: String!) {
    getInfraestructura(id_infraestructura: $idInfraestructura) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const ADD_INFRAESTRUCTURA_MUTATION = gql`
  mutation AddInfraestructura($nombreInfraestructura: String!, $tipoInfraestructura: String!, $descripcion: String!) {
    addInfraestructura(nombre_infraestructura: $nombreInfraestructura, tipo_infraestructura: $tipoInfraestructura, descripcion: $descripcion) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const UPDATE_INFRAESTRUCTURA_MUTATION = gql`
  mutation UpdateInfraestructura($idInfraestructura: String!, $descripcion: String, $tipoInfraestructura: String, $nombreInfraestructura: String) {
    updateInfraestructura(id_infraestructura: $idInfraestructura, descripcion: $descripcion, tipo_infraestructura: $tipoInfraestructura, nombre_infraestructura: $nombreInfraestructura) {
      id_infraestructura
      nombre_infraestructura
      tipo_infraestructura
      descripcion
    }
  }
`;

const DELETE_INFRAESTRUCTURA_MUTATION = gql`
  mutation DeleteInfraestructura($idInfraestructura: String!) {
    deleteInfraestructura(id_infraestructura: $idInfraestructura) {
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
      variables: { idInfraestructura: id },
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

export const updateInfraestructuraService = async (data: Partial<Infraestructura> & { idInfraestructura: string }) => {
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
      variables: { idInfraestructura: id },
    });
    return response.data.deleteInfraestructura;
  } catch (error) {
    throw new Error(`Error deleting infraestructura: ${error}`);
  }
};
