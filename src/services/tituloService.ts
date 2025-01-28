import { gql } from '@apollo/client';
import client from '../apolloClient';
import { TituloBasic } from '../slices/tituloSlice';


const LIST_TITULOS_QUERY = gql`
  query ListTitulos {
    listTitulos {
      id_titulo
      id_presupuesto
      id_titulo_padre
      id_titulo_plantilla
      item
      descripcion
      parcial
      fecha_creacion
      especialidad_id
      nivel
      orden
      tipo
    }
  }
`;

const GET_TITULOS_BY_PRESUPUESTO_QUERY = gql`
  query GetTitulosByPresupuesto($idPresupuesto: String!) {
    getTitulosByPresupuesto(id_presupuesto: $idPresupuesto) {
      id_titulo
      id_presupuesto
      id_titulo_padre
      id_titulo_plantilla
      detallePartida {
        id_detalle_partida
        id_unidad
        id_titulo
        metrado
        precio
        jornada
      }
      item
      descripcion
      parcial
      fecha_creacion
      especialidad_id
      nivel
      orden
      tipo
    }
  }
`;

const GET_TITULO_QUERY = gql`
  query GetTitulo($idTitulo: String!) {
    getTitulo(id_titulo: $idTitulo) {
      id_titulo
      id_presupuesto
      id_titulo_padre
      id_titulo_plantilla
      detallePartida {
        id_detalle_partida
        id_unidad
        id_titulo
        metrado
        precio
        jornada
      }
      item
      descripcion
      parcial
      fecha_creacion
      especialidad_id
      nivel
      orden
      tipo
    }
  }
`;

const ADD_TITULO_MUTATION = gql`
  mutation AddTitulo($idPresupuesto: String!, $item: String!, $descripcion: String!, $parcial: Float!, $especialidadId: String!, $nivel: Int!, $orden: Int!, $tipo: TipoTitulo!, $idTituloPadre: String, $idTituloPlantilla: String) {
    addTitulo(id_presupuesto: $idPresupuesto, item: $item, descripcion: $descripcion, parcial: $parcial, especialidad_id: $especialidadId, nivel: $nivel, orden: $orden, tipo: $tipo, id_titulo_padre: $idTituloPadre, id_titulo_plantilla: $idTituloPlantilla) {
      id_titulo
      id_presupuesto
      id_titulo_padre
      id_titulo_plantilla
      detallePartida {
        id_detalle_partida
        id_unidad
        id_titulo
        metrado
        precio
        jornada
      }
      item
      descripcion
      parcial
      fecha_creacion
      especialidad_id
      nivel
      orden
      tipo
    }
  }
`;

const UPDATE_TITULO_MUTATION = gql`
  mutation UpdateTitulo($idTitulo: String!, $tipo: TipoTitulo, $idTituloPadre: String, $parcial: Float, $descripcion: String, $item: String, $idTituloPlantilla: String, $especialidadId: String, $nivel: Int, $orden: Int) {
    updateTitulo(id_titulo: $idTitulo, tipo: $tipo, id_titulo_padre: $idTituloPadre, parcial: $parcial, descripcion: $descripcion, item: $item, id_titulo_plantilla: $idTituloPlantilla, especialidad_id: $especialidadId, nivel: $nivel, orden: $orden) {
      id_titulo
      id_presupuesto
      id_titulo_padre
      id_titulo_plantilla
      detallePartida {
        id_detalle_partida
        id_unidad
        id_titulo
        metrado
        precio
        jornada
      }
      item
      descripcion
      parcial
      fecha_creacion
      especialidad_id
      nivel
      orden
      tipo
    }
  }
`;

const DELETE_TITULO_MUTATION = gql`
  mutation DeleteTitulo($idTitulo: String!) {
    deleteTitulo(id_titulo: $idTitulo) {
      id_titulo
    }
  }
`;

export const listTitulosService = async () => {
  try {
    const response = await client.query({
      query: LIST_TITULOS_QUERY,
    });
    return response.data.listTitulos;
  } catch (error) {
    throw new Error(`Error fetching títulos: ${error}`);
  }
};

export const getTitulosByPresupuestoService = async (idPresupuesto: string) => {
  try {
    const response = await client.query({
      query: GET_TITULOS_BY_PRESUPUESTO_QUERY,
      variables: { idPresupuesto },
    });
    return response.data.getTitulosByPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching títulos by presupuesto: ${error}`);
  }
};

export const getTituloService = async (idTitulo: string) => {
  try {
    const response = await client.query({
      query: GET_TITULO_QUERY,
      variables: { idTitulo },
    });
    return response.data.getTitulo;
  } catch (error) {
    throw new Error(`Error fetching título: ${error}`);
  }
};

export const addTituloService = async (data: TituloBasic) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TITULO_MUTATION,
      variables: data,
    });
    return response.data.addTitulo;
  } catch (error) {
    throw new Error(`Error adding título: ${error}`);
  }
};

export const updateTituloService = async (data: TituloBasic) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TITULO_MUTATION,
      variables: data,
    });
    return response.data.updateTitulo;
  } catch (error) {
    throw new Error(`Error updating título: ${error}`);
  }
};

export const deleteTituloService = async (idTitulo: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_TITULO_MUTATION,
      variables: { idTitulo },
    });
    return response.data.deleteTitulo;
  } catch (error) {
    throw new Error(`Error deleting título: ${error}`);
  }
};
