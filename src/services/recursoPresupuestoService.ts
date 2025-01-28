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
  query GetRecursoPresupuesto($idRecurso: String!) {
    getRecursoPresupuesto(id_recurso: $idRecurso) {
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
  mutation AddRecursoPresupuesto($idUnidad: String!, $idClase: String!, $idTipo: String!, $idRecursoApp: String!, $nombre: String!, $precioReferencial: Float!) {
    addRecursoPresupuesto(id_unidad: $idUnidad, id_clase: $idClase, id_tipo: $idTipo, id_recurso_app: $idRecursoApp, nombre: $nombre, precio_referencial: $precioReferencial) {
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
  mutation UpdateRecursoPresupuesto($idRecurso: String!, $precioReferencial: Float, $nombre: String, $idRecursoApp: String, $idTipo: String, $idClase: String, $idUnidad: String) {
    updateRecursoPresupuesto(id_recurso: $idRecurso, precio_referencial: $precioReferencial, nombre: $nombre, id_recurso_app: $idRecursoApp, id_tipo: $idTipo, id_clase: $idClase, id_unidad: $idUnidad) {
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
  mutation DeleteRecursoPresupuesto($idRecurso: String!) {
    deleteRecursoPresupuesto(id_recurso: $idRecurso) {
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

export const getRecursoPresupuestoService = async (idRecurso: string) => {
  try {
    const response = await client.query({
      query: GET_RECURSO_PRESUPUESTO_QUERY,
      variables: { idRecurso },
    });
    return response.data.getRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching recurso presupuesto: ${error}`);
  }
};

export const addRecursoPresupuestoService = async (data: {
  idUnidad: string;
  idClase: string;
  idTipo: string;
  idRecursoApp: string;
  nombre: string;
  precioReferencial: number;
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
  idRecurso: string;
  precioReferencial?: number;
  nombre?: string;
  idRecursoApp?: string;
  idTipo?: string;
  idClase?: string;
  idUnidad?: string;
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

export const deleteRecursoPresupuestoService = async (idRecurso: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_RECURSO_PRESUPUESTO_MUTATION,
      variables: { idRecurso },
    });
    return response.data.deleteRecursoPresupuesto;
  } catch (error) {
    throw new Error(`Error deleting recurso presupuesto: ${error}`);
  }
};
