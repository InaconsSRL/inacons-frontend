import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ARCHIVOS_PAGO = gql`
  query ListArchivosPago {
    listArchivosPago {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
      file
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      fecha
    }
  }
`;

const GET_ARCHIVOS_BY_ORDEN_PAGO = gql`
  query GetArchivosByOrdenPago($ordenPagoId: ID!) {
    getArchivosByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        estado
        observaciones
        comprobante
        fecha
      }
      file
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      fecha
    }
  }
`;

// Agregar nuevas mutaciones
const ADD_ARCHIVO_PAGO = gql`
  mutation AddArchivoPago(
    $orden_pago_id: ID!
    $file: String!
    $usuario_id: ID!
  ) {
    addArchivoPago(
      orden_pago_id: $orden_pago_id
      file: $file
      usuario_id: $usuario_id
    ) {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
      file
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      fecha
    }
  }
`;

const UPDATE_ARCHIVO_PAGO = gql`
  mutation UpdateArchivoPago(
    $id: ID!
    $orden_pago_id: ID!
    $file: String!
    $usuario_id: ID!
  ) {
    updateArchivoPago(
      id: $id
      orden_pago_id: $orden_pago_id
      file: $file
      usuario_id: $usuario_id
    ) {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
      file
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      fecha
    }
  }
`;

const DELETE_ARCHIVO_PAGO = gql`
  mutation DeleteArchivoPago($id: ID!) {
    deleteArchivoPago(id: $id) {
      id
    }
  }
`;

const UPLOAD_ARCHIVO_PAGO = gql`
  mutation UploadArchivoPago($orden_pago_id: ID!, $usuario_id: ID!, $file: Upload!) {
    uploadArchivoPago(
      orden_pago_id: $orden_pago_id
      usuario_id: $usuario_id
      file: $file
    ) {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        observaciones
        comprobante
        fecha
      }
      file
      usuario_id {
        id
        nombres
        apellidos
      }
      fecha
    }
  }
`;

export interface ArchivoPago {
  id: string;
  orden_pago_id: {
    id: string;
    codigo: string;
    monto_solicitado: number;
    tipo_moneda: string;
    tipo_pago: string;
    estado: string;
    observaciones: string;
    comprobante: string;
    fecha: string;
  };
  file: string;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
    dni: string;
    usuario: string;
    contrasenna: string;
    rol_id: string;
  };
  fecha: string;
}

// Agregar interface para el input
export interface ArchivoPagoInput {
  orden_pago_id: string;
  file: string;
  usuario_id: string;
}

// Servicios
export const listArchivosPagoService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_ARCHIVOS_PAGO,
    });
    return data.listArchivosPago;
  } catch (error) {
    throw new Error(`Error fetching archivos pago: ${error}`);
  }
};

export const getArchivosByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_ARCHIVOS_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getArchivosByOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching archivos by orden pago: ${error}`);
  }
};

// Agregar nuevos servicios
export const addArchivoPagoService = async (input: ArchivoPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_ARCHIVO_PAGO,
      variables: input,
    });
    return data.addArchivoPago;
  } catch (error) {
    throw new Error(`Error adding archivo pago: ${error}`);
  }
};

export const updateArchivoPagoService = async (id: string, input: ArchivoPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_ARCHIVO_PAGO,
      variables: { id, ...input },
    });
    return data.updateArchivoPago;
  } catch (error) {
    throw new Error(`Error updating archivo pago: ${error}`);
  }
};

export const deleteArchivoPagoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ARCHIVO_PAGO,
      variables: { id },
    });
    return data.deleteArchivoPago;
  } catch (error) {
    throw new Error(`Error deleting archivo pago: ${error}`);
  }
};

export const uploadArchivoPagoService = async (ordenPagoId: string, userId: string, formData: FormData) => {
  try {
    console.log('Service received FormData:', {
      hasFile: formData.has('0'),
      operations: formData.get('operations'),
      map: formData.get('map')
    });

    const { data } = await client.mutate({
      mutation: UPLOAD_ARCHIVO_PAGO,
      variables: {
        orden_pago_id: ordenPagoId,
        usuario_id: userId,
        file: formData.get('0')
      },
      context: {
        hasUpload: true
      }
    });

    console.log('Service response:', data);
    return data.uploadArchivoPago;
  } catch (error) {
    console.error('Service error details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Error uploading archivo pago: ${error}`);
  }
};
