import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_RECURSOS_PRESUPUESTO_QUERY = gql`
  query ListRecursosPresupuesto {
    listRecursosPresupuesto {
      id_recurso
      nombre
      id_unidad
      id_clase
      id_tipo
      id_recurso_app
      precio_referencial
      fecha_actualizacion
    }
  }
`;

const GET_RECURSO_PRESUPUESTO_QUERY = gql`
  query GetRecursoPresupuesto($id_recurso: String!) {
    getRecursoPresupuesto(id_recurso: $id_recurso) {
      id_recurso
      nombre
      id_unidad
      id_clase
      id_tipo
      id_recurso_app
      precio_referencial
      fecha_actualizacion
    }
  }
`;

const ADD_RECURSO_PRESUPUESTO_MUTATION = gql`
  mutation AddRecursoPresupuesto($id_unidad: String!, $id_clase: String!, $id_tipo: String!, $id_recurso_app: String!, $nombre: String!, $precio_referencial: Float!) {
    addRecursoPresupuesto(id_unidad: $id_unidad, id_clase: $id_clase, id_tipo: $id_tipo, id_recurso_app: $id_recurso_app, nombre: $nombre, precio_referencial: $precio_referencial) {
      id_recurso
      nombre
      id_unidad
      id_clase
      id_tipo
      id_recurso_app
      precio_referencial
      fecha_actualizacion
    }
  }
`;

const UPDATE_RECURSO_PRESUPUESTO_MUTATION = gql`
  mutation UpdateRecursoPresupuesto($id_recurso: String!, $precio_referencial: Float, $nombre: String, $id_recurso_app: String, $id_tipo: String, $id_clase: String, $id_unidad: String) {
    updateRecursoPresupuesto(id_recurso: $id_recurso, precio_referencial: $precio_referencial, nombre: $nombre, id_recurso_app: $id_recurso_app, id_tipo: $id_tipo, id_clase: $id_clase, id_unidad: $id_unidad) {
      id_recurso
      nombre
      id_unidad
      id_clase
      id_tipo
      id_recurso_app
      precio_referencial
      fecha_actualizacion
    }
  }
`;

const DELETE_RECURSO_PRESUPUESTO_MUTATION = gql`
  mutation DeleteRecursoPresupuesto($id_recurso: String!) {
    deleteRecursoPresupuesto(id_recurso: $id_recurso) {
      id_recurso
    }
  }
`;

export const listRecursosPresupuestoService = async () => {
  try {
    const response = await client.query({
      query: LIST_RECURSOS_PRESUPUESTO_QUERY,
    });
    return response.data.listRecursosPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching recursos presupuesto: ${error}`);
  }
};

export const getRecursoPresupuestoService = async (id_recurso: string) => {
  try {
    const response = await client.query({
      query: GET_RECURSO_PRESUPUESTO_QUERY,
      variables: { id_recurso },
    });
    return response.data.getRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching recurso presupuesto: ${error}`);
  }
};

export const addRecursoPresupuestoService = async (data: {
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  id_recurso_app: string;
  nombre: string;
  precio_referencial: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_RECURSO_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.addRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error adding recurso presupuesto: ${error}`);
  }
};

export const updateRecursoPresupuestoService = async (data: {
  id_recurso: string;
  precio_referencial?: number;
  nombre?: string;
  id_recurso_app?: string;
  id_tipo?: string;
  id_clase?: string;
  id_unidad?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_RECURSO_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.updateRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error updating recurso presupuesto: ${error}`);
  }
};

export const deleteRecursoPresupuestoService = async (id_recurso: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_RECURSO_PRESUPUESTO_MUTATION,
      variables: { id_recurso },
    });
    return response.data.deleteRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error deleting recurso presupuesto: ${error}`);
  }
};
