import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ALMACENES_QUERY = gql`
  query ListAlmacenes {
    listAlmacenes {
      id
      nombre
      ubicacion
      direccion
      estado
      obra_id
      tipo_almacen_id
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
      estado
      obra_id
      tipo_almacen_id
    }
  }
`;

const ADD_ALMACEN_MUTATION = gql`
  mutation AddAlmacen($nombre: String!, $ubicacion: String!, $direccion: String!, $estado: Boolean!, $obraId: ID!, $tipoAlmacenId: ID!) {
    addAlmacen(nombre: $nombre, ubicacion: $ubicacion, direccion: $direccion, estado: $estado, obra_id: $obraId, tipo_almacen_id: $tipoAlmacenId) {
      id
      nombre
      ubicacion
      direccion
      estado
      obra_id
      tipo_almacen_id
    }
  }
`;

const UPDATE_ALMACEN_MUTATION = gql`
  mutation UpdateAlmacen($updateAlmacenId: ID!, $tipoAlmacenId: ID, $obraId: ID, $estado: Boolean, $direccion: String, $ubicacion: String, $nombre: String) {
    updateAlmacen(id: $updateAlmacenId, tipo_almacen_id: $tipoAlmacenId, obra_id: $obraId, estado: $estado, direccion: $direccion, ubicacion: $ubicacion, nombre: $nombre) {
      id
      nombre
      ubicacion
      direccion
      estado
      obra_id
      tipo_almacen_id
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
  estado: boolean;
  obra_id: string;
  tipo_almacen_id: string;
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
  nombre?: string;
  ubicacion?: string;
  direccion?: string;
  estado?: boolean;
  obra_id?: string;
  tipo_almacen_id?: string;
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