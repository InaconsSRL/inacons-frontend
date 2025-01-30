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

export const uploadArchivoPagoService = async (ordenPagoId: string, userId: string, file: File) => {
  try {
    const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI;
    
    // Crear FormData
    const formData = new FormData();
    
    // Preparar la operación GraphQL
    formData.append('operations', JSON.stringify({
      query: `
        mutation UploadArchivoPago($orden_pago_id: ID!, $usuario_id: ID!, $file: Upload!) {
          uploadArchivoPago(orden_pago_id: $orden_pago_id, usuario_id: $usuario_id, file: $file) {
            id
            file
            orden_pago_id {
              id
              codigo
            }
            usuario_id {
              id
              nombres
            }
            fecha
          }
        }
      `,
      variables: {
        orden_pago_id: ordenPagoId,
        usuario_id: userId,
        file: null
      }
    }));

    // Mapear el archivo a la variable
    formData.append('map', JSON.stringify({
      "0": ["variables.file"]
    }));

    // Añadir el archivo
    formData.append('0', file);

    // Realizar la petición fetch directamente
    const response = await fetch(GRAPHQL_URI, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Error en la subida del archivo');
    }

    return result.data.uploadArchivoPago;
  } catch (error) {
    console.error('Error en uploadArchivoPagoService:', error);
    throw error;
  }
};
