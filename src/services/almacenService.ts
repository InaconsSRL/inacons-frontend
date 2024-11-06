import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ALMACENES_QUERY = gql`
  query ListAlmacenes {
    listAlmacenes {
      id
      nombre
      ubicacion
      direccion
      tipo
    }
  }
`;

const GET_ALMACEN_QUERY = gql`
query GetAlmacen($getAlmacenId: ID!) {
    getAlmacen(id: $getAlmacenId) {
      id
      nombre
      ubicacion
      direccion
      tipo
    }
  }
`;

const ADD_ALMACEN_MUTATION = gql`
  mutation AddAlmacen($nombre: String!, $ubicacion: String!, $direccion: String!, $tipo: Boolean!) {
    addAlmacen(nombre: $nombre, ubicacion: $ubicacion, direccion: $direccion, tipo: $tipo) {
      id
      nombre
      ubicacion
      direccion
      tipo
    }
  }
`;

const UPDATE_ALMACEN_MUTATION = gql`
  mutation UpdateAlmacen($updateAlmacenId: ID!, $nombre: String, $ubicacion: String, $direccion: String, $tipo: Boolean) {
    updateAlmacen(id: $updateAlmacenId, nombre: $nombre, ubicacion: $ubicacion, direccion: $direccion, tipo: $tipo) {
      id
      nombre
      ubicacion
      direccion
      tipo
    }
  }
`;

const DELETE_ALMACEN_MUTATION = gql`
  mutation DeleteAlmacen($deleteAlmacenId: ID!) {
    deleteAlmacen(id: $deleteAlmacenId) {
      id
    }
  }
`;

export const getAlmacenService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_ALMACEN_QUERY,
      variables: { getAlmacenId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getAlmacen;
  } catch (error) {
    console.error('Error al obtener el almacén:', error);
    throw error;
  }
};

export const listAlmacenesService = async () => {
  try {
    const response = await client.query({
      query: LIST_ALMACENES_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listAlmacenes;
  } catch (error) {
    console.error('Error al obtener la lista de almacenes:', error);
    throw error;
  }
};

export const addAlmacenService = async (almacenData: { 
  nombre: string; 
  ubicacion: string;
  direccion: string;
  tipo: boolean;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ALMACEN_MUTATION,
      variables: almacenData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addAlmacen;
  } catch (error) {
    console.error('Error al crear el almacén:', error);
    throw error;
  }
};

export const updateAlmacenService = async (almacen: {
  id: string;
  nombre: string;
  ubicacion: string;
  direccion: string;
  tipo: boolean;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ALMACEN_MUTATION,
      variables: {
        updateAlmacenId: almacen.id,
        ...almacen
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateAlmacen;
  } catch (error) {
    console.error('Error al actualizar el almacén:', error);
    throw error;
  }
};

export const deleteAlmacenService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ALMACEN_MUTATION,
      variables: { deleteAlmacenId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteAlmacen;
  } catch (error) {
    console.error('Error al eliminar el almacén:', error);
    throw error;
  }
};