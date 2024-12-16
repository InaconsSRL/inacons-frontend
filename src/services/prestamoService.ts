import { gql } from '@apollo/client';
import client from '../apolloClient';

// Queries
const LIST_PRESTAMOS = gql`
  query ListPrestamos {
    listPrestamos {
      id
      movimiento_id {
        id
        tipo
      }
      personal_id {
        id
        cargo {
          id
          nombre
        }
        nombres
      }
      usuario_id {
        id
        nombres
        rol_id
        cargo_id {
          id
        }
      }
      fecha
      f_retorno
      estado
      almacen_id {
        id
        nombre
        tipo_almacen_id
      }
    }
  }
`;

const ADD_PRESTAMO = gql`
  mutation AddPrestamo(
    $movimiento_id: ID!
    $personal_id: ID!
    $usuario_id: ID!
    $fecha: DateTime!
    $f_retorno: DateTime!
    $estado: String!
    $almacen_id: ID!
  ) {
    addPrestamo(
      movimiento_id: $movimiento_id
      personal_id: $personal_id
      usuario_id: $usuario_id
      fecha: $fecha
      f_retorno: $f_retorno
      estado: $estado
      almacen_id: $almacen_id
    ) {
      id
      movimiento_id {
        id
        tipo
      }
      personal_id {
        id
        cargo {
          id
          nombre
        }
        nombres
      }
      usuario_id {
        id
        nombres
        rol_id
        cargo_id {
          id
        }
      }
      fecha
      f_retorno
      estado
      almacen_id {
        id
        nombre
        tipo_almacen_id
      }
    }
  }
`;

const UPDATE_PRESTAMO = gql`
  mutation UpdatePrestamo(
    $id: ID!
    $movimiento_id: ID
    $personal_id: ID
    $usuario_id: ID
    $fecha: DateTime
    $f_retorno: DateTime
    $estado: String
    $almacen_id: ID
  ) {
    updatePrestamo(
      id: $id
      movimiento_id: $movimiento_id
      personal_id: $personal_id
      usuario_id: $usuario_id
      fecha: $fecha
      f_retorno: $f_retorno
      estado: $estado
      almacen_id: $almacen_id
    ) {
      id
      movimiento_id {
        id
        tipo
      }
      personal_id {
        id
        cargo {
          id
          nombre
        }
        nombres
      }
      usuario_id {
        id
        nombres
        rol_id
        cargo_id {
          id
        }
      }
      fecha
      f_retorno
      estado
      almacen_id {
        id
        nombre
        tipo_almacen_id
      }
    }
  }
`;

const DELETE_PRESTAMO = gql`
  mutation DeletePrestamo($id: ID!) {
    deletePrestamo(id: $id) {
      id
    }
  }
`;

// Service functions
export const listPrestamosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRESTAMOS,
    });
    return data.listPrestamos;
  } catch (error) {
    console.error('Error fetching prestamos:', error);
    throw error;
  }
};

export const addPrestamoService = async (prestamoData: {
  movimiento_id: string;
  personal_id: string;
  usuario_id: string;
  fecha: Date;
  f_retorno: Date;
  estado: string;
  almacen_id: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRESTAMO,
      variables: prestamoData,
    });
    return data.addPrestamo;
  } catch (error) {
    console.error('Error adding prestamo:', error);
    throw error;
  }
};

export const updatePrestamoService = async (prestamoData: {
  id: string;
  movimiento_id?: string;
  personal_id?: string;
  usuario_id?: string;
  fecha?: Date;
  f_retorno?: Date;
  estado?: string;
  almacen_id?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRESTAMO,
      variables: prestamoData,
    });
    return data.updatePrestamo;
  } catch (error) {
    console.error('Error updating prestamo:', error);
    throw error;
  }
};

export const deletePrestamoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRESTAMO,
      variables: { id },
    });
    return data.deletePrestamo.id;
  } catch (error) {
    console.error('Error deleting prestamo:', error);
    throw error;
  }
};
