import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_MOVILIDADES = gql`
  query ListMovilidades {
    listMovilidades {
      id
      denominacion
      descripcion
    }
  }
`;

const ADD_MOVILIDAD = gql`
  mutation AddMovilidad($denominacion: String!, $descripcion: String) {
    addMovilidad(denominacion: $denominacion, descripcion: $descripcion) {
      id
      denominacion
      descripcion
    }
  }
`;

const UPDATE_MOVILIDAD = gql`
  mutation UpdateMovilidad($updateMovilidadId: ID!, $denominacion: String, $descripcion: String) {
    updateMovilidad(id: $updateMovilidadId, denominacion: $denominacion, descripcion: $descripcion) {
      id
      denominacion
      descripcion
    }
  }
`;

const DELETE_MOVILIDAD = gql`
  mutation DeleteMovilidad($deleteMovilidadId: ID!) {
    deleteMovilidad(id: $deleteMovilidadId) {
      id
    }
  }
`;

export const listMovilidadesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_MOVILIDADES,
    });
    return data.listMovilidades;
  } catch (error) {
    throw new Error(`Error fetching movilidades: ${error}`);
  }
};

export const addMovilidadService = async (movilidadData: { denominacion: string; descripcion?: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_MOVILIDAD,
      variables: movilidadData,
    });
    return data.addMovilidad;
  } catch (error) {
    throw new Error(`Error adding movilidad: ${error}`);
  }
};

export const updateMovilidadService = async (
  id: string,
  movilidadData: { denominacion?: string; descripcion?: string }
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_MOVILIDAD,
      variables: { updateMovilidadId: id, ...movilidadData },
    });
    return data.updateMovilidad;
  } catch (error) {
    throw new Error(`Error updating movilidad: ${error}`);
  }
};

export const deleteMovilidadService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_MOVILIDAD,
      variables: { deleteMovilidadId: id },
    });
    return data.deleteMovilidad;
  } catch (error) {
    throw new Error(`Error deleting movilidad: ${error}`);
  }
};
