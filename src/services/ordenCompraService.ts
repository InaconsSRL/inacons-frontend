import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ORDEN_COMPRAS_QUERY = gql`
  query ListOrdenCompras {
    listOrdenCompras {
      id
      codigo_orden
      cotizacion_id {
        id
      }
      estado
      descripcion
      fecha_ini
      fecha_fin
    }
  }
`;

const ADD_ORDEN_COMPRA_MUTATION = gql`
  mutation AddOrdenCompra($codigoOrden: String!, $cotizacionId: ID!, $descripcion: String!, $fechaIni: DateTime!, $fechaFin: DateTime!, $estado: Boolean) {
    addOrdenCompra(codigo_orden: $codigoOrden, cotizacion_id: $cotizacionId, descripcion: $descripcion, fecha_ini: $fechaIni, fecha_fin: $fechaFin, estado: $estado) {
      id
      codigo_orden
      cotizacion_id {
        id
      }
      estado
      descripcion
      fecha_ini
      fecha_fin
    }
  }
`;

const UPDATE_ORDEN_COMPRA_MUTATION = gql`
  mutation UpdateOrdenCompra($updateOrdenCompraId: ID!, $codigoOrden: String!, $cotizacionId: ID!, $descripcion: String!, $fechaIni: DateTime!, $fechaFin: DateTime!, $estado: Boolean) {
    updateOrdenCompra(id: $updateOrdenCompraId, codigo_orden: $codigoOrden, cotizacion_id: $cotizacionId, descripcion: $descripcion, fecha_ini: $fechaIni, fecha_fin: $fechaFin, estado: $estado) {
      id
      codigo_orden
      cotizacion_id {
        id
      }
      estado
      descripcion
      fecha_ini
      fecha_fin
    }
  }
`;

const DELETE_ORDEN_COMPRA_MUTATION = gql`
  mutation DeleteOrdenCompra($deleteOrdenCompraId: ID!) {
    deleteOrdenCompra(id: $deleteOrdenCompraId) {
      id
    }
  }
`;

export interface OrdenCompra {
  id: string;
  codigo_orden: string;
  cotizacion_id: {id:string};
  estado: boolean;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
}
export interface OrdenCompraUpdate {
  id: string;
  codigo_orden: string;
  cotizacion_id: string;
  estado: boolean;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
}

export const listOrdenComprasService = async () => {
  try {
    const response = await client.query({
      query: LIST_ORDEN_COMPRAS_QUERY,
    });
    return response.data.listOrdenCompras;
  } catch (error) {
    console.error('Error al listar órdenes de compra:', error);
    throw error;
  }
};

export const addOrdenCompraService = async (ordenCompra: Omit<OrdenCompraUpdate, 'id'>) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ORDEN_COMPRA_MUTATION,
      variables: {
        codigoOrden: ordenCompra.codigo_orden,
        cotizacionId: ordenCompra.cotizacion_id,
        descripcion: ordenCompra.descripcion,
        fechaIni: ordenCompra.fecha_ini,
        fechaFin: ordenCompra.fecha_fin,
        estado: ordenCompra.estado
      },
    });
    return response.data.addOrdenCompra;
  } catch (error) {
    console.error('Error al agregar orden de compra:', error);
    throw error;
  }
};

export const updateOrdenCompraService = async (ordenCompra: OrdenCompraUpdate) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ORDEN_COMPRA_MUTATION,
      variables: {
        updateOrdenCompraId: ordenCompra.id,
        codigoOrden: ordenCompra.codigo_orden,
        cotizacionId: ordenCompra.cotizacion_id,
        descripcion: ordenCompra.descripcion,
        fechaIni: ordenCompra.fecha_ini,
        fechaFin: ordenCompra.fecha_fin,
        estado: ordenCompra.estado
      },
    });
    return response.data.updateOrdenCompra;
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error);
    throw error;
  }
};

export const deleteOrdenCompraService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_ORDEN_COMPRA_MUTATION,
      variables: { deleteOrdenCompraId: id },
    });
    return response.data.deleteOrdenCompra;
  } catch (error) {
    console.error('Error al eliminar orden de compra:', error);
    throw error;
  }
};
