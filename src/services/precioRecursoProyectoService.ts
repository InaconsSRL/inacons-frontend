import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PRECIOS_RECURSO_PROYECTO_QUERY = gql`
  query ListPreciosRecursoProyecto {
    listPreciosRecursoProyecto {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const GET_PRECIOS_BY_RECURSO_COMPOSICION_APU_QUERY = gql`
  query GetPreciosByRecursoComposicionApu($id_rec_comp_apu: String!) {
    getPreciosByRecursoComposicionApu(id_rec_comp_apu: $id_rec_comp_apu) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const GET_PRECIO_RECURSO_PROYECTO_QUERY = gql`
  query GetPrecioRecursoProyecto($id_prp: String!) {
    getPrecioRecursoProyecto(id_prp: $id_prp) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const ADD_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation AddPrecioRecursoProyecto($id_proyecto: String!, $id_rec_comp_apu: String!, $precio: Float!) {
    addPrecioRecursoProyecto(id_proyecto: $id_proyecto, id_rec_comp_apu: $id_rec_comp_apu, precio: $precio) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const UPDATE_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation UpdatePrecioRecursoProyecto($id_prp: String!, $precio: Float!) {
    updatePrecioRecursoProyecto(id_prp: $id_prp, precio: $precio) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const DELETE_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation DeletePrecioRecursoProyecto($id_prp: String!) {
    deletePrecioRecursoProyecto(id_prp: $id_prp) {
      id_prp
    }
  }
`;

export const listPreciosRecursoProyectoService = async () => {
  try {
    const response = await client.query({
      query: LIST_PRECIOS_RECURSO_PROYECTO_QUERY,
    });
    return response.data.listPreciosRecursoProyecto;
  } catch (error) {
    throw new Error(`Error fetching precios recurso proyecto: ${error}`);
  }
};

export const getPreciosByRecursoComposicionApuService = async (id_rec_comp_apu: string) => {
  try {
    const response = await client.query({
      query: GET_PRECIOS_BY_RECURSO_COMPOSICION_APU_QUERY,
      variables: { id_rec_comp_apu },
    });
    return response.data.getPreciosByRecursoComposicionApu;
  } catch (error) {
    throw new Error(`Error fetching precios by recurso composicion apu: ${error}`);
  }
};

export const getPrecioRecursoProyectoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_PRECIO_RECURSO_PROYECTO_QUERY,
      variables: { id_prp: id },
    });
    return response.data.getPrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error fetching precio recurso proyecto: ${error}`);
  }
};

export const addPrecioRecursoProyectoService = async (data: {
  id_proyecto: string;
  id_rec_comp_apu: string;
  precio: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PRECIO_RECURSO_PROYECTO_MUTATION,
      variables: data,
    });
    return response.data.addPrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error adding precio recurso proyecto: ${error}`);
  }
};

export const updatePrecioRecursoProyectoService = async (data: {
  id_prp: string;
  precio: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_PRECIO_RECURSO_PROYECTO_MUTATION,
      variables: data,
    });
    return response.data.updatePrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error updating precio recurso proyecto: ${error}`);
  }
};

export const deletePrecioRecursoProyectoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PRECIO_RECURSO_PROYECTO_MUTATION,
      variables: { id_prp: id },
    });
    return response.data.deletePrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error deleting precio recurso proyecto: ${error}`);
  }
};
