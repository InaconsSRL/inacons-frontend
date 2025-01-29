import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PROYECTOS_QUERY = gql`
  query ListProyectos {
    listProyectos {
      id_proyecto
      id_usuario
      id_infraestructura
      nombre_proyecto
      id_departamento
      id_provincia
      id_distrito
      id_localidad
      total_proyecto
      estado
      fecha_creacion
      cliente
      empresa
      plazo
      ppto_base
      ppto_oferta
      jornada
    }
  }
`;

const GET_PROYECTO_QUERY = gql`
  query GetProyecto($id_proyecto: String!) {
    getProyecto(id_proyecto: $id_proyecto) {
      id_proyecto
      id_usuario
      id_infraestructura
      nombre_proyecto
      id_departamento
      id_provincia
      id_distrito
      id_localidad
      total_proyecto
      estado
      fecha_creacion
      cliente
      empresa
      plazo
      ppto_base
      ppto_oferta
      jornada
    }
  }
`;

const ADD_PROYECTO_MUTATION = gql`
  mutation AddProyecto($id_usuario: String!, $id_infraestructura: String!, $nombre_proyecto: String!, $id_departamento: String!, $id_provincia: String!, $id_distrito: String!, $estado: String!, $cliente: String!, $empresa: String!, $plazo: Int!, $ppto_base: Float!, $ppto_oferta: Float!, $jornada: Float!, $id_localidad: String, $total_proyecto: Float) {
    addProyecto(id_usuario: $id_usuario, id_infraestructura: $id_infraestructura, nombre_proyecto: $nombre_proyecto, id_departamento: $id_departamento, id_provincia: $id_provincia, id_distrito: $id_distrito, estado: $estado, cliente: $cliente, empresa: $empresa, plazo: $plazo, ppto_base: $ppto_base, ppto_oferta: $ppto_oferta, jornada: $jornada, id_localidad: $id_localidad, total_proyecto: $total_proyecto) {
      id_proyecto
      id_usuario
      id_infraestructura
      nombre_proyecto
      id_departamento
      id_provincia
      id_distrito
      id_localidad
      total_proyecto
      estado
      fecha_creacion
      cliente
      empresa
      plazo
      ppto_base
      ppto_oferta
      jornada
    }
  }
`;

const UPDATE_PROYECTO_MUTATION = gql`
  mutation UpdateProyecto($id_proyecto: String!, $jornada: Float, $ppto_oferta: Float, $ppto_base: Float, $plazo: Int, $empresa: String, $cliente: String, $total_proyecto: Float, $estado: String, $nombre_proyecto: String) {
    updateProyecto(id_proyecto: $id_proyecto, jornada: $jornada, ppto_oferta: $ppto_oferta, ppto_base: $ppto_base, plazo: $plazo, empresa: $empresa, cliente: $cliente, total_proyecto: $total_proyecto, estado: $estado, nombre_proyecto: $nombre_proyecto) {
      id_proyecto
      id_usuario
      id_infraestructura
      nombre_proyecto
      id_departamento
      id_provincia
      id_distrito
      id_localidad
      total_proyecto
      estado
      fecha_creacion
      cliente
      empresa
      plazo
      ppto_base
      ppto_oferta
      jornada
    }
  }
`;

const DELETE_PROYECTO_MUTATION = gql`
  mutation DeleteProyecto($id_proyecto: String!) {
    deleteProyecto(id_proyecto: $id_proyecto) {
      id_proyecto
    }
  }
`;

export const listProyectosService = async () => {
  try {
    const response = await client.query({
      query: LIST_PROYECTOS_QUERY,
    });
    return response.data.listProyectos;
  } catch (error) {
    throw new Error(`Error fetching proyectos: ${error}`);
  }
};

export const getProyectoService = async (id_proyecto: string) => {
  try {
    const response = await client.query({
      query: GET_PROYECTO_QUERY,
      variables: { id_proyecto },
    });
    return response.data.getProyecto;
  } catch (error) {
    throw new Error(`Error fetching proyecto: ${error}`);
  }
};

export const addProyectoService = async (data: {
  id_usuario: string;
  id_infraestructura: string;
  nombre_proyecto: string;
  id_departamento: string;
  id_provincia: string;
  id_distrito: string;
  estado: string;
  cliente: string;
  empresa: string;
  plazo: number;
  ppto_base: number;
  ppto_oferta: number;
  jornada: number;
  id_localidad?: string;
  total_proyecto?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PROYECTO_MUTATION,
      variables: data,
    });
    return response.data.addProyecto;
  } catch (error) {
    throw new Error(`Error adding proyecto: ${error}`);
  }
};

export const updateProyectoService = async (data: {
  id_proyecto: string;
  jornada?: number;
  ppto_oferta?: number;
  ppto_base?: number;
  plazo?: number;
  empresa?: string;
  cliente?: string;
  total_proyecto?: number;
  estado?: string;
  nombre_proyecto?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_PROYECTO_MUTATION,
      variables: data,
    });
    return response.data.updateProyecto;
  } catch (error) {
    throw new Error(`Error updating proyecto: ${error}`);
  }
};

export const deleteProyectoService = async (id_proyecto: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PROYECTO_MUTATION,
      variables: { id_proyecto },
    });
    return response.data.deleteProyecto;
  } catch (error) {
    throw new Error(`Error deleting proyecto: ${error}`);
  }
};
