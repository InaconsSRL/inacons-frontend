import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_OBRA_QUERY = gql`
  query ListObras {
    listObras {
      id
      titulo
      nombre
      descripcion
      ubicacion
      direccion
      estado
      empresa_id {
        id
        nombre_comercial
        razon_social
        descripcion
        estado
        regimen_fiscal
        ruc
      }
      tipo_id {
        id
        nombre
      }
    }
  }
`;

const GET_OBRA_QUERY = gql`
  query GetObra($getObraId: ID!) {
    getObra(id: $getObraId) {
      id
      titulo
      nombre
      descripcion
      ubicacion
      direccion
      estado
      empresa_id {
        id
        nombre_comercial
        razon_social
        descripcion
        estado
        regimen_fiscal
        ruc
      }
      tipo_id {
        id
        nombre
      }
    }
  }
`;

const ADD_OBRA_MUTATION = gql`
  mutation AddObra($titulo: String, $nombre: String, $descripcion: String, $ubicacion: String, $direccion: String, $estado: String, $tipoId: ID, $empresaId: ID) {
    addObra(titulo: $titulo, nombre: $nombre, descripcion: $descripcion, ubicacion: $ubicacion, direccion: $direccion, estado: $estado, tipo_id: $tipoId, empresa_id: $empresaId) {
      id
      titulo
      nombre
      descripcion
      ubicacion
      direccion
      estado
      empresa_id {
        id
        nombre_comercial
        razon_social
        descripcion
        estado
        regimen_fiscal
        ruc
      }
      tipo_id {
        id
        nombre
      }
    }
  }
`;

const UPDATE_OBRA_MUTATION = gql`
  mutation UpdateObra($updateObraId: ID!, $titulo: String, $nombre: String, $descripcion: String, $ubicacion: String, $direccion: String, $estado: String, $tipoId: ID, $empresaId: ID) {
    updateObra(id: $updateObraId, titulo: $titulo, nombre: $nombre, descripcion: $descripcion, ubicacion: $ubicacion, direccion: $direccion, estado: $estado, tipo_id: $tipoId, empresa_id: $empresaId) {
      id
      titulo
      nombre
      descripcion
      ubicacion
      direccion
      estado
      empresa_id {
        id
        nombre_comercial
        razon_social
        descripcion
        estado
        regimen_fiscal
        ruc
      }
      tipo_id {
        id
        nombre
      }
    }
  }
`;

export const listObrasService = async () => {
  try {
    const response = await client.query({
      query: LIST_OBRA_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listObras;
  } catch (error) {
    console.error('Error al obtener la lista de obras:', error);
    throw error;
  }
};

export const getObraService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_OBRA_QUERY,
      variables: { getObraId: id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.getObra;
  } catch (error) {
    console.error('Error al obtener la obra:', error);
    throw error;
  }
};

export const addObraService = async (obraData: {
  titulo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  direccion: string;
  estado: string;
  tipoId: string;
  empresaId: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_OBRA_MUTATION,
      variables: {
        ...obraData,
        tipo_id: obraData.tipoId,
        empresa_id: obraData.empresaId
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addObra;
  } catch (error) {
    console.error('Error al crear la obra:', error);
    throw error;
  }
};

export const updateObraService = async (obra: {
  id: string;
  titulo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  direccion: string;
  estado: string;
  tipoId: string;
  empresaId: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_OBRA_MUTATION,
      variables: {
        updateObraId: obra.id,
        ...obra,
        tipo_id: obra.tipoId,
        empresa_id: obra.empresaId
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateObra;
  } catch (error) {
    console.error('Error al actualizar la obra:', error);
    throw error;
  }
};