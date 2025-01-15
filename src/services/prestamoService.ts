import { gql } from '@apollo/client';
import client from '../apolloClient';
import { PrestamoOutput, PrestamoInput, PrestamoUpdateInput } from '../slices/prestamoSlice';

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
      responsable_id {
        id
        nombres
        apellidos
      }
      obra_id {
        id
        nombre
      }
      personal_id {
        nombres
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
      }
    }
  }
`;

const ADD_PRESTAMO_MUTATION = gql`
  mutation AddPrestamo(
    $fecha: Date!, 
    $usuarioId: ID!, 
    $obraId: ID!, 
    $personalId: String!, 
    $fRetorno: Date!, 
    $estado: String!, 
    $transferenciaDetalleId: ID!, 
    $responsableId: ID!
  ) {
    addPrestamo(
      fecha: $fecha, 
      usuario_id: $usuarioId, 
      obra_id: $obraId, 
      personal_id: $personalId, 
      f_retorno: $fRetorno, 
      estado: $estado, 
      transferencia_detalle_id: $transferenciaDetalleId,
      responsable_id: $responsableId
    ) {
      id
      fecha
      usuario_id {
        id
        nombres
        apellidos
      }        
      responsable_id {
        id
        nombres
        apellidos
      }
      obra_id {
        id
        nombre
      }
      personal_id {
        nombres
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
      }
    }
  }
`;

const UPDATE_PRESTAMO_MUTATION = gql`
  mutation UpdatePrestamo(
    $updatePrestamoId: ID!, 
    $fecha: Date, 
    $usuarioId: String, 
    $personalId: ID, 
    $fRetorno: Date, 
    $estado: String, 
    $transferenciaDetalleId: ID
  ) {
    updatePrestamo(
      id: $updatePrestamoId, 
      fecha: $fecha, 
      usuario_id: $usuarioId, 
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
      }        
      responsable_id {
        id
        nombres
        apellidos
      }
      personal_id {
        nombres
      }
      f_retorno
      estado
      transferencia_detalle_id {
        id
      }
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
    return data.listPrestamos as PrestamoOutput[];
  } catch (error) {
    throw new Error(`Error fetching prestamos: ${error}`);
  }
};

export const addPrestamoService = async (prestamoData: PrestamoInput): Promise<PrestamoOutput> => {
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

export const updatePrestamoService = async (prestamoData: PrestamoUpdateInput): Promise<PrestamoOutput> => {
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
