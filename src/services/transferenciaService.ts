
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIAS_QUERY = gql`
  query ListTransferencias {
    listTransferencias {
      id
      usuario_id
      fecha
      movimiento_id
    }
  }
`;

const ADD_TRANSFERENCIA_MUTATION = gql`
  mutation AddTransferencia($usuarioId: ID!, $fecha: DateTime!, $movimientoId: ID!) {
    addTransferencia(usuario_id: $usuarioId, fecha: $fecha, movimiento_id: $movimientoId) {
      id
      usuario_id
      fecha
      movimiento_id
    }
  }
`;

const UPDATE_TRANSFERENCIA_MUTATION = gql`
  mutation UpdateTransferencia($updateTransferenciaId: ID!, $usuarioId: ID, $fecha: DateTime, $movimientoId: ID) {
    updateTransferencia(id: $updateTransferenciaId, usuario_id: $usuarioId, fecha: $fecha, movimiento_id: $movimientoId) {
      id
      usuario_id
      fecha
      movimiento_id
    }
  }
`;

const DELETE_TRANSFERENCIA_MUTATION = gql`
  mutation DeleteTransferencia($deleteTransferenciaId: ID!) {
    deleteTransferencia(id: $deleteTransferenciaId) {
      id
    }
  }
`;

export const listTransferenciasService = async () => {
    const response = await client.query({
      query: LIST_TRANSFERENCIAS_QUERY,
    });
    return response.data.listTransferencias;
};

export const addTransferenciaService = async (data: { usuario_id: string; fecha: Date; movimiento_id: string }) => {
    const response = await client.mutate({
      mutation: ADD_TRANSFERENCIA_MUTATION,
      variables: {
        usuarioId: data.usuario_id,
        fecha: data.fecha,
        movimientoId: data.movimiento_id,
      },
    });
    return response.data.addTransferencia;
};

export const updateTransferenciaService = async (data: { id: string; usuario_id?: string; fecha?: Date; movimiento_id?: string }) => {
    const response = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_MUTATION,
      variables: {
        updateTransferenciaId: data.id,
        usuarioId: data.usuario_id,
        fecha: data.fecha,
        movimientoId: data.movimiento_id,
      },
    });
    return response.data.updateTransferencia;
};

export const deleteTransferenciaService = async (id: string) => {
    const response = await client.mutate({
      mutation: DELETE_TRANSFERENCIA_MUTATION,
      variables: { deleteTransferenciaId: id },
    });
    return response.data.deleteTransferencia;
};