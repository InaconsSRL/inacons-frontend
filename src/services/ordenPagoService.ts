import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ORDEN_PAGOS = gql`
  query ListOrdenPagos {
    listOrdenPagos {
      id
      codigo
      monto_solicitado
      tipo_moneda
      tipo_pago
      orden_compra_id {
        id
        codigo_orden
        estado
        descripcion
        fecha_ini
        fecha_fin
      }
      estado
      observaciones
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      comprobante
      fecha
    }
  }
`;

const ADD_ORDEN_PAGO = gql`
  mutation AddOrdenPago(
    $monto_solicitado: Float!
    $tipo_moneda: String!
    $tipo_pago: String!
    $orden_compra_id: ID!
    $estado: String!
    $observaciones: String
    $usuario_id: ID!
    $comprobante: String
  ) {
    addOrdenPago(
      monto_solicitado: $monto_solicitado
      tipo_moneda: $tipo_moneda
      tipo_pago: $tipo_pago
      orden_compra_id: $orden_compra_id
      estado: $estado
      observaciones: $observaciones
      usuario_id: $usuario_id
      comprobante: $comprobante
    ) {
      id
      codigo
      monto_solicitado
      tipo_moneda
      tipo_pago
      orden_compra_id {
        id
        codigo_orden
        estado
        descripcion
        fecha_ini
        fecha_fin
      }
      estado
      observaciones
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      comprobante
      fecha
    }
  }
`;

const UPDATE_ORDEN_PAGO = gql`
  mutation UpdateOrdenPago(
    $id: ID!
    $monto_solicitado: Float!
    $tipo_moneda: String!
    $tipo_pago: String!
    $orden_compra_id: ID!
    $estado: String!
    $observaciones: String
    $usuario_id: ID!
    $comprobante: String
  ) {
    updateOrdenPago(
      id: $id
      monto_solicitado: $monto_solicitado
      tipo_moneda: $tipo_moneda
      tipo_pago: $tipo_pago
      orden_compra_id: $orden_compra_id
      estado: $estado
      observaciones: $observaciones
      usuario_id: $usuario_id
      comprobante: $comprobante
    ) {
      id
      codigo
      monto_solicitado
      tipo_moneda
      tipo_pago
      orden_compra_id {
        id
        codigo_orden
        estado
        descripcion
        fecha_ini
        fecha_fin
      }
      estado
      observaciones
      usuario_id {
        id
        nombres
        apellidos
        dni
        usuario
        contrasenna
        rol_id
      }
      comprobante
      fecha
    }
  }
`;

const DELETE_ORDEN_PAGO = gql`
  mutation DeleteOrdenPago($id: ID!) {
    deleteOrdenPago(id: $id) {
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
  }
`;

const GET_ORDEN_PAGO_BY_ORDEN_COMPRA = gql`
  query GetOrdenPagoByOrdenCompra($ordenCompraId: ID!) {
getOrdenPagoByOrdenCompra(ordenCompraId: $ordenCompraId) {
      _id
      codigo
      monto_solicitado
      tipo_moneda
      tipo_pago
      estado
      observaciones
      comprobante
      fecha
      monto_total
      orden_compra {
        codigo_orden
      }
      proveedor {
        razon_social
      }
      usuario_id {
        id
        nombres
      }
    }
  }
`;

interface OrdenPagoInput {
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  orden_compra_id: string;
  estado: string;
  observaciones?: string;
  usuario_id: string;
  comprobante?: string;
}

interface Proveedor {
  razon_social: string;
}

interface OrdenCompra {
  codigo_orden: string;
}

interface Usuario {
  id: string;
  nombres: string;
}

interface OrdenPagoByOrdenCompra {
    _id:  string;
  codigo: string;
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  estado: string;
  observaciones?: string;
  comprobante?: string;
  fecha: string;
  monto_total: number;
  orden_compra: OrdenCompra;
  proveedor: Proveedor;
  usuario_id: Usuario;
}


export const listOrdenPagosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_ORDEN_PAGOS,
    });
    return data.listOrdenPagos;
  } catch (error) {
    throw new Error(`Error fetching orden pagos bagos: ${error}`);
  }
};

/*
export const listOrdenPagosService = async () => {
  try {
    console.log('Iniciando consulta al gran apollo con GraphQL...');
    
    const { data, error, errors } = await client.query({
      query: LIST_ORDEN_PAGOS,
      fetchPolicy: 'network-only', // Forzar consulta al servidor
    });
    
    console.log('Respuesta completa:', { data, error, errors });
    
    if (errors) {
      console.error('Errores GraphQL:', errors);
    }
    
    if (!data || !data.listOrdenPagos) {
      console.warn('No hay datos en la respuesta:', data);
      return [];
    }
    
    return data.listOrdenPagos;
  } catch (error: any) {
    console.error('Error detallado:', {
      message: error.message,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors,
      stack: error.stack
    });
    throw new Error(`Error fetching orden pagos: ${error}`);
  }
};
*/

export const addOrdenPagoService = async (input: OrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_ORDEN_PAGO,
      variables: input,
    });
    return data.addOrdenPago;
  } catch (error) {
    throw new Error(`Error adding orden pago: ${error}`);
  }
};

export const updateOrdenPagoService = async (id: string, input: OrdenPagoInput) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_ORDEN_PAGO,
      variables: { id, ...input },
    });
    return data.updateOrdenPago;
  } catch (error) {
    throw new Error(`Error updating orden pago: ${error}`);
  }
};

export const deleteOrdenPagoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ORDEN_PAGO,
      variables: { id },
    });
    return data.deleteOrdenPago;
  } catch (error) {
    throw new Error(`Error deleting orden pago: ${error}`);
  }
};

export const getOrdenPagoByOrdenCompraService = async (ordenCompraId: string): Promise<OrdenPagoByOrdenCompra[]> => {
  try {
    const { data } = await client.query({
      query: GET_ORDEN_PAGO_BY_ORDEN_COMPRA,
      variables: { ordenCompraId },
      fetchPolicy: 'network-only', // Asegura obtener datos frescos del servidor
    });
    
    return data.getOrdenPagoByOrdenCompra;
  } catch (error: any) {
    console.error('Error al obtener órdenes de pago:', error);
    throw new Error(`Error fetching orden pagos by orden compra: ${error.message}`);
  }
};
