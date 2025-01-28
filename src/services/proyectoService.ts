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
  query GetProyecto($idProyecto: String!) {
    getProyecto(id_proyecto: $idProyecto) {
      _id
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
  mutation AddProyecto($idUsuario: String!, $idInfraestructura: String!, $nombreProyecto: String!, $idDepartamento: String!, $idProvincia: String!, $idDistrito: String!, $estado: String!, $cliente: String!, $empresa: String!, $plazo: Int!, $pptoBase: Float!, $pptoOferta: Float!, $jornada: Float!, $idLocalidad: String, $totalProyecto: Float) {
    addProyecto(id_usuario: $idUsuario, id_infraestructura: $idInfraestructura, nombre_proyecto: $nombreProyecto, id_departamento: $idDepartamento, id_provincia: $idProvincia, id_distrito: $idDistrito, estado: $estado, cliente: $cliente, empresa: $empresa, plazo: $plazo, ppto_base: $pptoBase, ppto_oferta: $pptoOferta, jornada: $jornada, id_localidad: $idLocalidad, total_proyecto: $totalProyecto) {
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
  mutation UpdateProyecto($idProyecto: String!, $jornada: Float, $pptoOferta: Float, $pptoBase: Float, $plazo: Int, $empresa: String, $cliente: String, $totalProyecto: Float, $estado: String, $nombreProyecto: String) {
    updateProyecto(id_proyecto: $idProyecto, jornada: $jornada, ppto_oferta: $pptoOferta, ppto_base: $pptoBase, plazo: $plazo, empresa: $empresa, cliente: $cliente, total_proyecto: $totalProyecto, estado: $estado, nombre_proyecto: $nombreProyecto) {
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
  mutation DeleteProyecto($idProyecto: String!) {
    deleteProyecto(id_proyecto: $idProyecto) {
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

export const getProyectoService = async (idProyecto: string) => {
  try {
    const response = await client.query({
      query: GET_PROYECTO_QUERY,
      variables: { idProyecto },
    });
    return response.data.getProyecto;
  } catch (error) {
    throw new Error(`Error fetching proyecto: ${error}`);
  }
};

export const addProyectoService = async (data: {
  idUsuario: string;
  idInfraestructura: string;
  nombreProyecto: string;
  idDepartamento: string;
  idProvincia: string;
  idDistrito: string;
  estado: string;
  cliente: string;
  empresa: string;
  plazo: number;
  pptoBase: number;
  pptoOferta: number;
  jornada: number;
  idLocalidad?: string;
  totalProyecto?: number;
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
  idProyecto: string;
  jornada?: number;
  pptoOferta?: number;
  pptoBase?: number;
  plazo?: number;
  empresa?: string;
  cliente?: string;
  totalProyecto?: number;
  estado?: string;
  nombreProyecto?: string;
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

export const deleteProyectoService = async (idProyecto: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PROYECTO_MUTATION,
      variables: { idProyecto },
    });
    return response.data.deleteProyecto;
  } catch (error) {
    throw new Error(`Error deleting proyecto: ${error}`);
  }
};
