import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_TRANSFERENCIA_DETALLES = gql`
  query ListTransferenciaDetalles {
    listTransferenciaDetalles {
      id
      transferencia_id {
        id
        usuario_id {
          id
          nombres
          apellidos
        }
        fecha
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
      }
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const ADD_TRANSFERENCIA_DETALLE = gql`
  mutation AddTransferenciaDetalle($transferenciaId: ID!, $referenciaId: String!, $tipo: String!, $referencia: String!, $fecha: DateTime) {
    addTransferenciaDetalle(transferencia_id: $transferenciaId, referencia_id: $referenciaId, tipo: $tipo, referencia: $referencia, fecha: $fecha) {
      id
      fecha
      referencia
      referencia_id
      tipo
      transferencia_id {
        id
        fecha
      }
    }
  }
`;

const UPDATE_TRANSFERENCIA_DETALLE = gql`
  mutation UpdateTransferenciaDetalle($updateTransferenciaDetalleId: ID!, $referencia: String, $tipo: String, $fecha: DateTime, $referenciaId: String, $transferenciaId: ID) {
    updateTransferenciaDetalle(id: $updateTransferenciaDetalleId, referencia: $referencia, tipo: $tipo, fecha: $fecha, referencia_id: $referenciaId, transferencia_id: $transferenciaId) {
      id
      transferencia_id {
        id
        fecha
      }
      referencia_id
      fecha
      tipo
      referencia
    }
  }
`;

const DELETE_TRANSFERENCIA_DETALLE = gql`
  mutation DeleteTransferenciaDetalle($deleteTransferenciaDetalleId: ID!) {
    deleteTransferenciaDetalle(id: $deleteTransferenciaDetalleId) {
      id
    }
  }
`;

const OBRA_ORIGEN_Y_DESTINO_BY_TRANSFERENCIA_ID = gql`
  query ListTransferenciaDetallesByTransferenciaId($transferenciaId: ID!) {
    listTransferenciaDetallesByTransferenciaId(transferencia_id: $transferenciaId) {
      referencia_id {
        obra_destino_id {
          nombre
          _id
        }
        obra_origen_id {
          nombre
          _id
        }
      }
    }
  }
`;

export const listTransferenciaDetallesService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_TRANSFERENCIA_DETALLES,
    });
    return data.listTransferenciaDetalles;
  } catch (error) {
    throw new Error(`Error fetching transferencia detalles: ${error}`);
  }
};

export const addTransferenciaDetalleService = async (transferenciaDetalle: {
  transferencia_id: string;
  referencia_id: string;
  fecha?: Date;
  tipo: string;
  referencia: string;
}) => {
  try {
    // Transformar los nombres de las variables para la mutación GraphQL
    const variables = {
      transferenciaId: transferenciaDetalle.transferencia_id,
      referenciaId: transferenciaDetalle.referencia_id,
      tipo: transferenciaDetalle.tipo,
      referencia: transferenciaDetalle.referencia,
      fecha: transferenciaDetalle.fecha,
    };

    const { data } = await client.mutate({
      mutation: ADD_TRANSFERENCIA_DETALLE,
      variables,
    });

    if (!data || !data.addTransferenciaDetalle) {
      throw new Error('No se recibió respuesta del servidor');
    }

    // Transformar la respuesta de vuelta a snake_case
    return {
      ...data.addTransferenciaDetalle,
      transferencia_id: data.addTransferenciaDetalle.transferencia_id,
      referencia_id: data.addTransferenciaDetalle.referencia_id,
    };
  } catch (error) {
    console.error('Error en addTransferenciaDetalleService:', error);
    throw new Error(`Error al agregar detalle de transferencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

export const updateTransferenciaDetalleService = async (transferenciaDetalle: {
  id: string;
  transferencia_id?: string;
  referencia_id?: string;
  fecha?: Date;
  tipo?: string;
  referencia?: string;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_TRANSFERENCIA_DETALLE,
      variables: {
        updateTransferenciaDetalleId: transferenciaDetalle.id,
        ...transferenciaDetalle,
      },
    });
    return data.updateTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error updating transferencia detalle: ${error}`);
  }
};

export const deleteTransferenciaDetalleService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_TRANSFERENCIA_DETALLE,
      variables: { deleteTransferenciaDetalleId: id },
    });
    return data.deleteTransferenciaDetalle;
  } catch (error) {
    throw new Error(`Error deleting transferencia detalle: ${error}`);
  }
};

export const getObraOrigenYDestinoByTransferenciaId = async (transferenciaId: string) => {
  try {
    const { data } = await client.query({
      query: OBRA_ORIGEN_Y_DESTINO_BY_TRANSFERENCIA_ID,
      variables: { transferenciaId },
    });
    return data.listTransferenciaDetallesByTransferenciaId;
  } catch (error) {
    throw new Error(`Error fetching obras origen y destino: ${error}`);
  }
};
