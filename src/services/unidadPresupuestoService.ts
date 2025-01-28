import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_UNIDADES_PRESUPUESTO_QUERY = gql`
  query ListUnidadesPresupuesto {
    listUnidadesPresupuesto {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const GET_UNIDAD_PRESUPUESTO_QUERY = gql`
  query GetUnidadPresupuesto($idUnidad: String!) {
    getUnidadPresupuesto(id_unidad: $idUnidad) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const ADD_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation AddUnidadPresupuesto($abreviaturaUnidad: String!, $descripcion: String!) {
    addUnidadPresupuesto(abreviatura_unidad: $abreviaturaUnidad, descripcion: $descripcion) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const UPDATE_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation UpdateUnidadPresupuesto($idUnidad: String!, $descripcion: String, $abreviaturaUnidad: String) {
    updateUnidadPresupuesto(id_unidad: $idUnidad, descripcion: $descripcion, abreviatura_unidad: $abreviaturaUnidad) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const DELETE_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation DeleteUnidadPresupuesto($idUnidad: String!) {
    deleteUnidadPresupuesto(id_unidad: $idUnidad) {
      id_unidad
    }
  }
`;

export const listUnidadesPresupuestoService = async () => {
  try {
    const response = await client.query({
      query: LIST_UNIDADES_PRESUPUESTO_QUERY,
    });
    return response.data.listUnidadesPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching unidades presupuesto: ${error}`);
  }
};

export const getUnidadPresupuestoService = async (idUnidad: string) => {
  try {
    const response = await client.query({
      query: GET_UNIDAD_PRESUPUESTO_QUERY,
      variables: { idUnidad },
    });
    return response.data.getUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching unidad presupuesto: ${error}`);
  }
};

export const addUnidadPresupuestoService = async (data: { 
  abreviaturaUnidad: string; 
  descripcion: string 
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_UNIDAD_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.addUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error adding unidad presupuesto: ${error}`);
  }
};

export const updateUnidadPresupuestoService = async (data: {
  idUnidad: string;
  descripcion?: string;
  abreviaturaUnidad?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_UNIDAD_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.updateUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error updating unidad presupuesto: ${error}`);
  }
};

export const deleteUnidadPresupuestoService = async (idUnidad: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_UNIDAD_PRESUPUESTO_MUTATION,
      variables: { idUnidad },
    });
    return response.data.deleteUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error deleting unidad presupuesto: ${error}`);
  }
};
