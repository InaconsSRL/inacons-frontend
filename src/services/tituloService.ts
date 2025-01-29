import { gql } from '@apollo/client';
import client from '../apolloClient';
import { Titulo } from '../slices/tituloSlice';


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
      id_especialidad
      nivel
      orden
      tipo
    }
  }
`;

const GET_TITULOS_BY_PRESUPUESTO_QUERY = gql`
  query GetTitulosByPresupuesto($id_presupuesto: String!) {
    getTitulosByPresupuesto(id_presupuesto: $id_presupuesto) {
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
      id_especialidad
      nivel
      orden
      tipo
    }
  }
`;

const GET_TITULO_QUERY = gql`
  query GetTitulo($id_titulo: String!) {
    getTitulo(id_titulo: $id_titulo) {
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
      id_especialidad
      nivel
      orden
      tipo
    }
  }
`;

const ADD_TITULO_MUTATION = gql`
  mutation AddTitulo($id_presupuesto: String!, $item: String!, $descripcion: String!, $parcial: Float!, $id_especialidad: String!, $nivel: Int!, $orden: Float!, $tipo: TipoTitulo!, $id_titulo_padre: String, $id_titulo_plantilla: String) {
    addTitulo(id_presupuesto: $id_presupuesto, item: $item, descripcion: $descripcion, parcial: $parcial, id_especialidad: $id_especialidad, nivel: $nivel, orden: $orden, tipo: $tipo, id_titulo_padre: $id_titulo_padre, id_titulo_plantilla: $id_titulo_plantilla) {
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
      id_especialidad
      nivel
      orden
      tipo
    }
  }
`;

const UPDATE_TITULO_MUTATION = gql`
  mutation UpdateTitulo($id_titulo: String!, $tipo: TipoTitulo, $id_titulo_padre: String, $parcial: Float, $descripcion: String, $item: String, $id_titulo_plantilla: String, $id_especialidad: String, $nivel: Int, $orden: Float) {
    updateTitulo(id_titulo: $id_titulo, tipo: $tipo, id_titulo_padre: $id_titulo_padre, parcial: $parcial, descripcion: $descripcion, item: $item, id_titulo_plantilla: $id_titulo_plantilla, id_especialidad: $id_especialidad, nivel: $nivel, orden: $orden) {
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
      id_especialidad
      nivel
      orden
      tipo
    }
  }
`;

const DELETE_TITULO_MUTATION = gql`
  mutation DeleteTitulo($id_titulo: String!) {
    deleteTitulo(id_titulo: $id_titulo) {
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

export const getTitulosByPresupuestoService = async (id_presupuesto: string) => {
  try {
    const response = await client.query({
      query: GET_TITULOS_BY_PRESUPUESTO_QUERY,
      variables: { id_presupuesto },
    });
    return response.data.getTitulosByPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching títulos by presupuesto: ${error}`);
  }
};

export const getTituloService = async (id_titulo: string) => {
  try {
    const response = await client.query({
      query: GET_TITULO_QUERY,
      variables: { id_titulo },
    });
    return response.data.getTitulo;
  } catch (error) {
    throw new Error(`Error fetching título: ${error}`);
  }
};

export const addTituloService = async (data: Titulo) => {
  try {
    const response = await client.mutate({
      mutation: ADD_TITULO_MUTATION,
      variables: {
        id_presupuesto: data.id_presupuesto,
        item: data.item,
        descripcion: data.descripcion,
        parcial: data.parcial,
        id_especialidad: data.id_especialidad,
        nivel: data.nivel,
        orden: data.orden,
        tipo: data.tipo,
        id_titulo_padre: data.id_titulo_padre,
        id_titulo_plantilla: data.id_titulo_plantilla,
      },
    });
    return response.data.addTitulo;
  } catch (error) {
    throw new Error(`Error adding título: ${error}`);
  }
};

export const updateTituloService = async (data: Titulo) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_TITULO_MUTATION,
      variables: {
        id_titulo: data.id_titulo,
        tipo: data.tipo,
        id_titulo_padre: data.id_titulo_padre,
        parcial: data.parcial,
        descripcion: data.descripcion,
        item: data.item,
        id_titulo_plantilla: data.id_titulo_plantilla,
        id_especialidad: data.id_especialidad,
        nivel: data.nivel,
        orden: data.orden,
      },
    });
    return response.data.updateTitulo;
  } catch (error) {
    throw new Error(`Error updating título: ${error}`);
  }
};

export const deleteTituloService = async (id_titulo: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_TITULO_MUTATION,
      variables: { id_titulo },
    });
    return response.data.deleteTitulo;
  } catch (error) {
    throw new Error(`Error deleting título: ${error}`);
  }
};
