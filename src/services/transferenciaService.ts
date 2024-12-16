import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIAS_QUERY = gql`
  query ListTransferencias {
    listTransferencias {
      id
      fecha
      estado
      movimiento_id {
        id
        nombre
        descripcion
        tipo
      }
      movilidad_id {
        id
        denominacion
        descripcion
      }
      usuario_id {
        apellidos
        nombres
        id
      }
    }
  }
`;

const ADD_TRANSFERENCIA_MUTATION = gql`
  mutation AddTransferencia($usuario_id: ID!, $movimiento_id: ID!, $movilidad_id: ID!, $fecha: DateTime, $estado: String) {
    addTransferencia(
      usuario_id: $usuario_id, 
      movimiento_id: $movimiento_id, 
      movilidad_id: $movilidad_id, 
      fecha: $fecha,
      estado: $estado
    ) {
      id
      fecha
      estado
      movimiento_id {
        id
        nombre
        descripcion
        tipo
      }
      movilidad_id {
        id
        denominacion
        descripcion
      }
      usuario_id {
        apellidos
        nombres
        id
      }
    }
  }
`;

const UPDATE_TRANSFERENCIA_MUTATION = gql`
  mutation UpdateTransferencia(
    $updateTransferenciaId: ID!, 
    $usuario_id: ID, 
    $fecha: DateTime, 
    $movimiento_id: ID, 
    $movilidad_id: ID,
    $estado: String
  ) {
    updateTransferencia(
      id: $updateTransferenciaId, 
      usuario_id: $usuario_id, 
      fecha: $fecha, 
      movimiento_id: $movimiento_id, 
      movilidad_id: $movilidad_id,
      estado: $estado
    ) {
      id
      fecha
      estado
      movimiento_id {
        id
        nombre
        descripcion
        tipo
      }
      movilidad_id {
        id
        denominacion
        descripcion
      }
      usuario_id {
        apellidos
        nombres
        id
      }
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

export const addTransferenciaService = async (data: { 
  usuario_id: string; 
  fecha: Date; 
  movimiento_id: string;
  movilidad_id: string;
  estado?: 'PARCIAL' | 'COMPLETO';
}) => {
    const response = await client.mutate({
      mutation: ADD_TRANSFERENCIA_MUTATION,
      variables: {
        usuario_id: data.usuario_id,
        fecha: data.fecha,
        movimiento_id: data.movimiento_id,
        movilidad_id: data.movilidad_id,
        estado: data.estado,
      },
    });
    return response.data.addTransferencia;
};

export const updateTransferenciaService = async (data: { 
  id: string; 
  usuario_id?: string; 
  fecha?: Date; 
  movimiento_id?: string;
  movilidad_id?: string;
  estado?: 'PARCIAL' | 'COMPLETO';
}) => {
    const response = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_MUTATION,
      variables: {
        updateTransferenciaId: data.id,
        usuario_id: data.usuario_id,
        fecha: data.fecha,
        movimiento_id: data.movimiento_id,
        movilidad_id: data.movilidad_id,
        estado: data.estado,
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
