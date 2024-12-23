import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_PRESTAMOS_QUERY = gql`
  query ListPrestamos {
    listPrestamos {
      id
      fecha
      usuario_id {
        id
        nombres
        apellidos
      }
      obra_id {
        id
        nombre
        estado
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
        referencia_id
        fecha
        tipo
        referencia
      }
      personal_id
    }
  }
`;

const ADD_PRESTAMO_MUTATION = gql`
  mutation AddPrestamo(
    $fecha: Date!, 
    $usuarioId: ID!, 
    $obraId: ID!, 
    $fRetorno: Date!, 
    $estado: String!, 
    $transferenciaDetalleId: ID!, 
    $personalId: String!
  ) {
    addPrestamo(
      fecha: $fecha, 
      usuario_id: $usuarioId, 
      obra_id: $obraId, 
      f_retorno: $fRetorno, 
      estado: $estado, 
      transferencia_detalle_id: $transferenciaDetalleId, 
      personal_id: $personalId
    ) {
      id
      fecha
      usuario_id {
        id
        nombres
        apellidos
      }
      obra_id {
        id
        nombre
        estado
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
      }
      personal_id
    }
  }
`;

const UPDATE_PRESTAMO_MUTATION = gql`
  mutation UpdatePrestamo(
    $updatePrestamoId: ID!, 
    $fecha: Date, 
    $usuarioId: String, 
    $obraId: ID, 
    $personalId: ID, 
    $fRetorno: Date, 
    $estado: String, 
    $transferenciaDetalleId: ID
  ) {
    updatePrestamo(
      id: $updatePrestamoId, 
      fecha: $fecha, 
      usuario_id: $usuarioId, 
      obra_id: $obraId, 
      personal_id: $personalId, 
      f_retorno: $fRetorno, 
      estado: $estado, 
      transferencia_detalle_id: $transferenciaDetalleId
    ) {
      id
      fecha
      usuario_id {
        id
        nombres
        apellidos
      }
      obra_id {
        id
        nombre
        estado
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
      }
      personal_id
    }
  }
`;

const DELETE_PRESTAMO_MUTATION = gql`
  mutation DeletePrestamo($deletePrestamoId: ID!) {
    deletePrestamo(id: $deletePrestamoId) {
      id
    }
  }
`;

export const listPrestamosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_PRESTAMOS_QUERY,
    });
    return data.listPrestamos;
  } catch (error) {
    throw new Error(`Error fetching prestamos: ${error}`);
  }
};

export const addPrestamoService = async (prestamoData: {
  fecha: Date;
  usuarioId: string;
  obraId: string;
  fRetorno: Date;
  estado: string;
  transferenciaDetalleId: string;
  personalId: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_PRESTAMO_MUTATION,
      variables: prestamoData,
    });
    return data.addPrestamo;
  } catch (error) {
    throw new Error(`Error adding prestamo: ${error}`);
  }
};

export const updatePrestamoService = async (prestamoData: {
  id: string;
  fecha?: Date;
  usuarioId?: string;
  obraId?: string;
  personalId?: string;
  fRetorno?: Date;
  estado?: string;
  transferenciaDetalleId?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PRESTAMO_MUTATION,
      variables: {
        updatePrestamoId: prestamoData.id,
        ...prestamoData
      },
    });
    return data.updatePrestamo;
  } catch (error) {
    throw new Error(`Error updating prestamo: ${error}`);
  }
};

export const deletePrestamoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PRESTAMO_MUTATION,
      variables: { deletePrestamoId: id },
    });
    return data.deletePrestamo;
  } catch (error) {
    throw new Error(`Error deleting prestamo: ${error}`);
  }
};
