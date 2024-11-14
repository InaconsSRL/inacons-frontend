
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_GUIA_TRANSFERENCIAS = gql`
  query ListGuiaTransferencias {
    listGuiaTransferencias {
      id
      transferencia_id
      cod_guia
      usuario_id
      tipo
      observacion
      fecha
    }
  }
`;

const LIST_GUIA_TRANSFERENCIAS_BY_TRANSFERENCIA_ID = gql`
  query ListGuiaTransferenciasByTransferenciaId($transferenciaId: ID!) {
    listGuiaTransferenciasByTransferenciaId(transferencia_id: $transferenciaId) {
      id
      transferencia_id
      cod_guia
      usuario_id
      tipo
      observacion
      fecha
    }
  }
`;

const ADD_GUIA_TRANSFERENCIA = gql`
  mutation AddGuiaTransferencia($transferenciaId: ID!, $codGuia: String!, $usuarioId: ID!, $tipo: String!, $fecha: DateTime!, $observacion: String) {
    addGuiaTransferencia(transferencia_id: $transferenciaId, cod_guia: $codGuia, usuario_id: $usuarioId, tipo: $tipo, fecha: $fecha, observacion: $observacion) {
      id
      transferencia_id
      cod_guia
      usuario_id
      tipo
      observacion
      fecha
    }
  }
`;

const UPDATE_GUIA_TRANSFERENCIA = gql`
  mutation UpdateGuiaTransferencia($updateGuiaTransferenciaId: ID!, $fecha: DateTime, $observacion: String, $tipo: String, $usuarioId: ID, $codGuia: String, $transferenciaId: ID) {
    updateGuiaTransferencia(id: $updateGuiaTransferenciaId, fecha: $fecha, observacion: $observacion, tipo: $tipo, usuario_id: $usuarioId, cod_guia: $codGuia, transferencia_id: $transferenciaId) {
      id
      transferencia_id
      cod_guia
      usuario_id
      tipo
      observacion
      fecha
    }
  }
`;

const DELETE_GUIA_TRANSFERENCIA = gql`
  mutation DeleteGuiaTransferencia($deleteGuiaTransferenciaId: ID!) {
    deleteGuiaTransferencia(id: $deleteGuiaTransferenciaId) {
      id
    }
  }
`;

export const listGuiaTransferenciasService = async () => {
  const { data } = await client.query({ query: LIST_GUIA_TRANSFERENCIAS });
  return data.listGuiaTransferencias;
};

export const listGuiaTransferenciasByTransferenciaIdService = async (transferenciaId: string) => {
  const { data } = await client.query({
    query: LIST_GUIA_TRANSFERENCIAS_BY_TRANSFERENCIA_ID,
    variables: { transferenciaId },
  });
  return data.listGuiaTransferenciasByTransferenciaId;
};

export const addGuiaTransferenciaService = async (guiaData: {
  transferenciaId: string;
  codGuia: string;
  usuarioId: string;
  tipo: string;
  fecha: Date;
  observacion?: string;
}) => {
    const { data } = await client.mutate({
      mutation: ADD_GUIA_TRANSFERENCIA,
      variables: guiaData,
    });
    return data.addGuiaTransferencia;
};

export const updateGuiaTransferenciaService = async (guiaData: {
  id: string;
  fecha?: Date;
  observacion?: string;
  tipo?: string;
  usuarioId?: string;
  codGuia?: string;
  transferenciaId?: string;
}) => {
    const { data } = await client.mutate({
      mutation: UPDATE_GUIA_TRANSFERENCIA,
      variables: {
        updateGuiaTransferenciaId: guiaData.id,
        ...guiaData,
      },
    });
    return data.updateGuiaTransferencia;
  
};

export const deleteGuiaTransferenciaService = async (id: string) => {
    const { data } = await client.mutate({
      mutation: DELETE_GUIA_TRANSFERENCIA,
      variables: { deleteGuiaTransferenciaId: id },
    });
    return data.deleteGuiaTransferencia;
  
};