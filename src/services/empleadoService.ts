import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_EMPLEADOS = gql`
  query ListEmpleados {
    listEmpleados {
      id
      dni
      nombres
      apellidos
      telefono
      telefono_secundario
      cargo {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

// const GET_EMPLEADO = gql`
//   query GetEmpleado ($getEmpleadoDni: ID!) {
//     getEmpleado(id: $getEmpleadoId) {
//       id
//       dni
//       nombres
//       apellidos
//       telefono
//       telefono_secundario
//       cargo {
//         id
//         nombre
//         descripcion
//         gerarquia
//       }
//     }
//   }
// `;

const ADD_EMPLEADO = gql`
  mutation AddEmpleado($nombres: String!, $apellidos: String!, $telefono: String!, $dni: String!, $cargoId: ID!) {
    addEmpleado(nombres: $nombres, apellidos: $apellidos, telefono: $telefono, dni: $dni, cargo_id: $cargoId) {
      id
      nombres
      dni
      apellidos
      telefono
      telefono_secundario
      cargo {
        id
        nombre
        descripcion
        gerarquia
      }
    }
  }
`;

const UPDATE_EMPLEADO = gql`
  mutation UpdateEmpleado($updateEmpleadoId: ID!, $telefonoSecundario: String, $telefono: String, $dni: String!, $apellidos: String, $nombres: String) {
    updateEmpleado(id: $updateEmpleadoId, telefono_secundario: $telefonoSecundario, telefono: $telefono, dni: $dni, apellidos: $apellidos, nombres: $nombres) {
      id
      nombres
      dni
      apellidos
      telefono
      telefono_secundario
      cargo {
        id
        gerarquia
        descripcion
        nombre
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

export const listEmpleadosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_EMPLEADOS,
    });
    return data.listEmpleados;
  } catch (error) {
    throw new Error(`Error fetching empleados: ${error}`);
  }
};

export const addEmpleadoService = async (empleado: { nombres: string; apellidos: string; telefono: string; cargo_id: string; dni: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_EMPLEADO,
      variables: {
        dni: empleado.dni,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        telefono: empleado.telefono,
        cargoId: empleado.cargo_id
      },
    });
    return data.addEmpleado;
  } catch (error) {
    throw new Error(`Error adding empleado: ${error}`);
  }
};

export const updateEmpleadoService = async (empleado: { id: string; dni?: string; nombres?: string; apellidos?: string; telefono?: string; telefono_secundario?: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_EMPLEADO,
      variables: {
        updateEmpleadoId: empleado.id,
        dni: empleado.dni,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        telefono: empleado.telefono,
        telefonoSecundario: empleado.telefono_secundario
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
