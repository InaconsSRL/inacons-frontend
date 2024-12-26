import { gql } from '@apollo/client';
import client from '../apolloClient';

interface Cargo {
  id: string;
  nombre: string;
  descripcion: string;
  gerarquia: number;
}

interface EmpleadoResponse {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  telefono_secundario?: string;
  cargo_id: Cargo;
}

// Actualizar el query para reflejar el cambio de nombre de campo
const LIST_EMPLEADOS = gql`
  query ListEmpleados {
    listEmpleados {
      id
      dni
      nombres
      apellidos
      telefono
      telefono_secundario
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

const GET_EMPLEADO_BY_DNI = gql`
  query GetEmpleadoByDni($getEmpleadoByDniId: ID!) {
    getEmpleadoByDni(id: $getEmpleadoByDniId) {
      id
      nombres
      apellidos
      telefono
      telefono_secundario
      dni
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

const ADD_EMPLEADO = gql`
  mutation AddEmpleado($nombres: String!, $apellidos: String!, $telefono: String!, $dni: String!, $cargo_id: ID!, $telefono_secundario: String) {
    addEmpleado(nombres: $nombres, apellidos: $apellidos, telefono: $telefono, dni: $dni, cargo_id: $cargo_id, telefono_secundario: $telefono_secundario) {
      id
      nombres
      apellidos
      telefono
      telefono_secundario
      dni
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

const UPDATE_EMPLEADO = gql`
  mutation UpdateEmpleado($updateEmpleadoId: ID!, $nombres: String, $apellidos: String, $telefono: String, $telefono_secundario: String, $dni: String, $cargo_id: ID) {
    updateEmpleado(id: $updateEmpleadoId, nombres: $nombres, apellidos: $apellidos, telefono: $telefono, telefono_secundario: $telefono_secundario, dni: $dni, cargo_id: $cargo_id) {
      id
      nombres
      apellidos
      telefono
      telefono_secundario
      dni
      cargo_id {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

const DELETE_EMPLEADO = gql`
  mutation DeleteEmpleado($deleteEmpleadoId: ID!) {
    deleteEmpleado(id: $deleteEmpleadoId) {
      id
    }
  }
`;

export const listEmpleadosService = async (): Promise<EmpleadoResponse[]> => {
  try {
    const { data } = await client.query({
      query: LIST_EMPLEADOS,
    });
    return data.listEmpleados;
  } catch (error) {
    throw new Error(`Error fetching empleados: ${error}`);
  }
};

export const getEmpleadoByDniService = async (id: string): Promise<EmpleadoResponse> => {
  try {
    const { data } = await client.query({
      query: GET_EMPLEADO_BY_DNI,
      variables: { getEmpleadoByDniId: id },
    });
    return data.getEmpleadoByDni;
  } catch (error) {
    throw new Error(`Error fetching empleado: ${error}`);
  }
};

export const addEmpleadoService = async (empleado: {
  nombres: string;
  apellidos: string;
  telefono: string;
  cargo_id: string;
  dni: string;
  telefono_secundario?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_EMPLEADO,
      variables: empleado,
    });
    return data.addEmpleado;
  } catch (error) {
    throw new Error(`Error adding empleado: ${error}`);
  }
};

export const updateEmpleadoService = async (empleado: {
  id: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  telefono_secundario?: string;
  dni?: string;
  cargo_id?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_EMPLEADO,
      variables: {
        updateEmpleadoId: empleado.id,
        ...empleado
      },
    });
    return data.updateEmpleado;
  } catch (error) {
    throw new Error(`Error updating empleado: ${error}`);
  }
};

export const deleteEmpleadoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_EMPLEADO,
      variables: { deleteEmpleadoId: id },
    });
    return data.deleteEmpleado;
  } catch (error) {
    throw new Error(`Error deleting empleado: ${error}`);
  }
};
