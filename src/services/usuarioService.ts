import { gql } from '@apollo/client';
import client from '../apolloClient';

// Definición de tipos
interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string | CargoDetallado;
  rol_id: string;
}

interface CargoDetallado {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

interface UsuarioInput {
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  contrasenna: string;
  cargo_id: string;
  rol_id: string;
}

interface QueryResponse {
  getAllUsuarios: Usuario[];
  listCargo: Cargo[];
}

const GET_ALL_USUARIOS_AND_CARGOS_QUERY = gql`
  query Query {
    getAllUsuarios {
      id
      nombres
      apellidos
      dni
      usuario
      contrasenna
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
      rol_id
    }
    listCargo {
    id
    nombre
    descripcion
    gerarquia
    }
    usuariosCargo {
      id
      nombres
      apellidos
      dni
      usuario
      rol_id
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
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
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
      rol_id
    }
  }
`;

export const getAllUsuariosAndCargosService = async (): Promise<QueryResponse> => {
  try {
    const response = await client.query<QueryResponse>({
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

const removeTypename = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename) as T;
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {} as T;
    for (const key in obj) {
      if (key !== '__typename') {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

export const createUsuarioService = async (usuarioData: UsuarioInput): Promise<Usuario> => {
  try {
    const cleanedData = removeTypename(usuarioData);
    console.log(cleanedData);
    const response = await client.mutate<{ createUsuario: Usuario }>({
      mutation: CREATE_USUARIO_MUTATION,
      variables: { data: cleanedData },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data!.createUsuario;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};

export const updateUsuarioService = async (usuario: Usuario): Promise<Usuario> => {
  try {
    const { id, ...data } = usuario;
    const cleanedData = removeTypename(data);
    console.log("este es el id:", id, ", esta es la data limpia:", cleanedData);
    const response = await client.mutate<{ updateUsuario: Usuario }>({
      mutation: UPDATE_USUARIO_MUTATION,
      variables: { updateUsuarioId: id, data: cleanedData },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data!.updateUsuario;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};