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
  query GetUnidadPresupuesto($id_unidad: String!) {
    getUnidadPresupuesto(id_unidad: $id_unidad) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const ADD_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation AddUnidadPresupuesto($abreviatura_unidad: String!, $descripcion: String!) {
    addUnidadPresupuesto(abreviatura_unidad: $abreviatura_unidad, descripcion: $descripcion) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const UPDATE_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation UpdateUnidadPresupuesto($id_unidad: String!, $descripcion: String, $abreviatura_unidad: String) {
    updateUnidadPresupuesto(id_unidad: $id_unidad, descripcion: $descripcion, abreviatura_unidad: $abreviatura_unidad) {
      id_unidad
      abreviatura_unidad
      descripcion
    }
  }
`;

const DELETE_UNIDAD_PRESUPUESTO_MUTATION = gql`
  mutation DeleteUnidadPresupuesto($id_unidad: String!) {
    deleteUnidadPresupuesto(id_unidad: $id_unidad) {
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

export const getUnidadPresupuestoService = async (id_unidad: string) => {
  try {
    const response = await client.query({
      query: GET_UNIDAD_PRESUPUESTO_QUERY,
      variables: { id_unidad },
    });
    return response.data.getUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching unidad presupuesto: ${error}`);
  }
};

export const addUnidadPresupuestoService = async (data: { 
  abreviatura_unidad: string; 
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
  id_unidad: string;
  descripcion?: string;
  abreviatura_unidad?: string;
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

export const deleteUnidadPresupuestoService = async (id_unidad: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_UNIDAD_PRESUPUESTO_MUTATION,
      variables: { id_unidad },
    });
    return response.data.deleteUnidadPresupuesto;
  } catch (error) {
    throw new Error(`Error deleting unidad presupuesto: ${error}`);
  }
};
