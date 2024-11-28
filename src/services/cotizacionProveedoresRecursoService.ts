import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACION_PROVEEDORES_RECURSOS = gql`
  query ListCotizacionProveedoresRecursos {
    listCotizacionProveedoresRecursos {
      id
      cotizacion_proveedor_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        cantidad
        precio_actual
        vigente
        imagenes {
          file
        }
        unidad_id
      }
      cantidad
      costo
    }
  }
`;

const GET_COTIZACIONES_BY_PROVEEDOR = gql`
  query GetCotizacionesByProveedorId($getCotizacionesByProveedorIdId: ID!) {
    getCotizacionesByProveedorId(id: $getCotizacionesByProveedorIdId) {
      id
      cotizacion_proveedor_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        cantidad
        precio_actual
        vigente
        imagenes {
          file
        }
        unidad_id
      }
      cantidad
      costo
    }
  }
`;

const ADD_COTIZACION_PROVEEDORES_RECURSO = gql`
  mutation AddCotizacionProveedoresRecurso($cotizacion_proveedor_id: ID!, $recurso_id: ID!, $cantidad: Int!, $costo: Float!) {
    addCotizacionProveedoresRecurso(
      cotizacion_proveedor_id: $cotizacion_proveedor_id
      recurso_id: $recurso_id
      cantidad: $cantidad
      costo: $costo
    ) {
      id
      cotizacion_proveedor_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        cantidad
        precio_actual
        vigente
        imagenes {
          file
        }
        unidad_id
      }
      cantidad
      costo
    }
  }
`;

const UPDATE_COTIZACION_PROVEEDORES_RECURSO = gql`
  mutation UpdateCotizacionProveedoresRecurso(
    $updateCotizacionProveedoresRecursoId: ID!
    $cotizacion_proveedor_id: ID
    $recurso_id: ID
    $cantidad: Int
    $costo: Float
  ) {
    updateCotizacionProveedoresRecurso(
      id: $updateCotizacionProveedoresRecursoId
      cotizacion_proveedor_id: $cotizacion_proveedor_id
      recurso_id: $recurso_id
      cantidad: $cantidad
      costo: $costo
    ) {
      id
      cotizacion_proveedor_id {
        id
      }
      recurso_id {
        id
        codigo
        nombre
        descripcion
        cantidad
        precio_actual
        vigente
        imagenes {
          file
        }
        unidad_id
      }
      cantidad
      costo
    }
  }
`;

const DELETE_COTIZACION_PROVEEDORES_RECURSO = gql`
  mutation DeleteCotizacionProveedoresRecurso($deleteCotizacionProveedoresRecursoId: ID!) {
    deleteCotizacionProveedoresRecurso(id: $deleteCotizacionProveedoresRecursoId) {
      id
    }
  }
`;

export const listCotizacionProveedoresRecursos = async () => {
  try {
    const { data } = await client.query({
      query: LIST_COTIZACION_PROVEEDORES_RECURSOS,
    });
    return data.listCotizacionProveedoresRecursos;
  } catch (error) {
    throw new Error(`Error fetching cotizaciones: ${error}`);
  }
};

export const getCotizacionesByProveedorId = async (providerId: string) => {
  try {
    const { data } = await client.query({
      query: GET_COTIZACIONES_BY_PROVEEDOR,
      variables: { getCotizacionesByProveedorIdId: providerId },
    });
    return data.getCotizacionesByProveedorId;
  } catch (error) {
    throw new Error(`Error fetching cotizaciones by proveedor: ${error}`);
  }
};

export const addCotizacionProveedoresRecurso = async (cotizacionData: {
  cotizacion_proveedor_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_COTIZACION_PROVEEDORES_RECURSO,
      variables: cotizacionData,
    });
    return data.addCotizacionProveedoresRecurso;
  } catch (error) {
    throw new Error(`Error adding cotización: ${error}`);
  }
};

export const updateCotizacionProveedoresRecurso = async (cotizacionData: {
  id: string;
  cotizacion_proveedor_id?: string;
  recurso_id?: string;
  cantidad?: number;
  costo?: number;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_COTIZACION_PROVEEDORES_RECURSO,
      variables: {
        updateCotizacionProveedoresRecursoId: cotizacionData.id,
        ...cotizacionData
      },
    });
    return data.updateCotizacionProveedoresRecurso;
  } catch (error) {
    throw new Error(`Error updating cotización: ${error}`);
  }
};

export const deleteCotizacionProveedoresRecurso = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_COTIZACION_PROVEEDORES_RECURSO,
      variables: { deleteCotizacionProveedoresRecursoId: id },
    });
    return data.deleteCotizacionProveedoresRecurso;
  } catch (error) {
    throw new Error(`Error deleting cotización: ${error}`);
  }
};