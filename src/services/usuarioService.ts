import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_ALL_USUARIOS_AND_CARGOS_QUERY = gql`
  query Query {
    getAllUsuarios {
      id
      nombres
      apellidos
      dni
      usuario
      contrasenna
      cargo_id
      rol_id
    }
    listCargo {
      id
      nombre
      descripcion
    }
  }
`;

const CREATE_USUARIO_MUTATION = gql`
  mutation CreateUsuario($data: UsuarioInput) {
    createUsuario(data: $data) {
      id
      nombres
      apellidos
      dni
      usuario
      contrasenna
      cargo_id
      rol_id
    }
  }
`;

const UPDATE_USUARIO_MUTATION = gql`
  mutation UpdateUsuario($updateUsuarioId: ID!, $data: UsuarioInput!) {
    updateUsuario(id: $updateUsuarioId, data: $data) {
      id
      nombres
      apellidos
      dni
      usuario
      contrasenna
      cargo_id
      rol_id
    }
  }
`;

export const getAllUsuariosAndCargosService = async () => {
  try {
    const response = await client.query({
      query: GET_ALL_USUARIOS_AND_CARGOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de usuarios y cargos:', error);
    throw error;
  }
};

export const createUsuarioService = async (usuarioData: any) => {
  try {
    const response = await client.mutate({
      mutation: CREATE_USUARIO_MUTATION,
      variables: { data: usuarioData },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.createUsuario;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};

export const updateUsuarioService = async (usuario: any) => {
  console.log(usuario)
  try {
    const { id, ...data } = usuario;
    const response = await client.mutate({
      mutation: UPDATE_USUARIO_MUTATION,
      variables: { updateUsuarioId: id, data },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateUsuario;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};