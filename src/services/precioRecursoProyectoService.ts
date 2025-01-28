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
  query GetPreciosByRecursoComposicionApu($idRecCompApu: String!) {
    getPreciosByRecursoComposicionApu(id_rec_comp_apu: $idRecCompApu) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const GET_PRECIO_RECURSO_PROYECTO_QUERY = gql`
  query GetPrecioRecursoProyecto($idPrp: String!) {
    getPrecioRecursoProyecto(id_prp: $idPrp) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const ADD_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation AddPrecioRecursoProyecto($idProyecto: String!, $idRecCompApu: String!, $precio: Float!) {
    addPrecioRecursoProyecto(id_proyecto: $idProyecto, id_rec_comp_apu: $idRecCompApu, precio: $precio) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const UPDATE_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation UpdatePrecioRecursoProyecto($idPrp: String!, $precio: Float!) {
    updatePrecioRecursoProyecto(id_prp: $idPrp, precio: $precio) {
      id_prp
      id_proyecto
      id_rec_comp_apu
      precio
      fecha_creacion
    }
  }
`;

const DELETE_PRECIO_RECURSO_PROYECTO_MUTATION = gql`
  mutation DeletePrecioRecursoProyecto($idPrp: String!) {
    deletePrecioRecursoProyecto(id_prp: $idPrp) {
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

export const getPreciosByRecursoComposicionApuService = async (idRecCompApu: string) => {
  try {
    const response = await client.query({
      query: GET_PRECIOS_BY_RECURSO_COMPOSICION_APU_QUERY,
      variables: { idRecCompApu },
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
      variables: { idPrp: id },
    });
    return response.data.getPrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error fetching precio recurso proyecto: ${error}`);
  }
};

export const addPrecioRecursoProyectoService = async (data: {
  idProyecto: string;
  idRecCompApu: string;
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
  idPrp: string;
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
      variables: { idPrp: id },
    });
    return response.data.deletePrecioRecursoProyecto;
  } catch (error) {
    throw new Error(`Error deleting precio recurso proyecto: ${error}`);
  }
};
