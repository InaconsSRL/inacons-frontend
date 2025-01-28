import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COMPROBANTES_PAGO = gql`
  query ListComprobantesPago {
    listComprobantesPago {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        fecha
      }
      file
      fecha
    }
  }
`;

const GET_COMPROBANTES_BY_ORDEN_PAGO = gql`
  query GetComprobantesByOrdenPago($ordenPagoId: ID!) {
    getComprobantesByOrdenPago(ordenPagoId: $ordenPagoId) {
      id
      orden_pago_id {
        id
        codigo
        monto_solicitado
        tipo_moneda
        tipo_pago
        estado
        fecha
      }
      file
      fecha
    }
  }
`;


const DELETE_COMPROBANTE_PAGO = gql`
  mutation DeleteComprobantePago($id: ID!) {
    deleteComprobantePago(id: $id) {
      id
    }
  }
`;

export interface ComprobantePago {
  id: string;
  orden_pago_id: {
    id: string;
    codigo: string;
    monto_solicitado: number;
    tipo_moneda: string;
    tipo_pago: string;
    estado: string;
    fecha: string;
  };
  file: string;
  fecha: string;
}

export const listComprobantesPagoService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_COMPROBANTES_PAGO,
    });
    return data.listComprobantesPago;
  } catch (error) {
    throw new Error(`Error fetching comprobantes pago: ${error}`);
  }
};

export const getComprobantesByOrdenPagoService = async (ordenPagoId: string) => {
  try {
    const { data } = await client.query({
      query: GET_COMPROBANTES_BY_ORDEN_PAGO,
      variables: { ordenPagoId },
    });
    return data.getComprobantesByOrdenPago;
  } catch (error) {
    throw new Error(`Error fetching comprobantes by orden pago: ${error}`);
  }
};

export const uploadComprobantePagoService = async (ordenPagoId: string, file: File) => {
  try {
    const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI;
    const formData = new FormData();
    
    formData.append('operations', JSON.stringify({
      query: `
        mutation UploadComprobantePago($orden_pago_id: ID!, $file: Upload!) {
          uploadComprobantePago(orden_pago_id: $orden_pago_id, file: $file) {
            id
            file
            orden_pago_id {
              id
              codigo
            }
            fecha
          }
        }
      `,
      variables: {
        orden_pago_id: ordenPagoId,
        file: null
      }
    }));

    formData.append('map', JSON.stringify({
      "0": ["variables.file"]
    }));

    formData.append('0', file);

    const response = await fetch(GRAPHQL_URI, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Error al subir el comprobante');
    }

    return result.data.uploadComprobantePago;
  } catch (error) {
    console.error('Error en uploadComprobantePagoService:', error);
    throw error;
  }
};

export const deleteComprobantePagoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_COMPROBANTE_PAGO,
      variables: { id },
    });
    return data.deleteComprobantePago;
  } catch (error) {
    throw new Error(`Error deleting comprobante pago: ${error}`);
  }
};
