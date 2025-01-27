import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_COTIZACIONES_QUERY = gql`
  query ListCotizaciones {
    listCotizaciones {
      id
    codigo_cotizacion
    usuario_id {
     id
     nombres
     apellidos
    }
    solicitud_compra_id {
     id
    
     fecha
    }
    aprobacion
    estado
    fecha
    }
  }
`;

const GET_COTIZACION_QUERY = gql`
  query GetCotizacion($getCotizacionId: ID!) {
    getCotizacion(id: $getCotizacionId) {
      id
    codigo_cotizacion
    usuario_id {
     id
     nombres
     apellidos
    }
    solicitud_compra_id {
     id
    
     fecha
    }
    aprobacion
    estado
    fecha
  }
}
`;

const ADD_COTIZACION_MUTATION = gql`
  mutation AddCotizacion($usuario_id: ID!, $estado: String!, $fecha: DateTime!, $codigo_cotizacion: String!, $aprobacion: Boolean!) {
    addCotizacion(usuario_id: $usuario_id, codigo_cotizacion: $codigo_cotizacion, estado: $estado, aprobacion: $aprobacion, fecha: $fecha) {
      id
    codigo_cotizacion
    usuario_id {
     id
     nombres
     apellidos
    }
    solicitud_compra_id {
     id
    
     fecha
    }
    aprobacion
    estado
    fecha
    }
  }
`;

const UPDATE_COTIZACION_MUTATION = gql`
  mutation UpdateCotizacion($id: ID!, $solicitud_compra_id: ID, $aprobacion: Boolean, $estado: String, $fecha: DateTime, $usuario_id: ID, $codigo_cotizacion: String) {
    updateCotizacion(id: $id, solicitud_compra_id: $solicitud_compra_id, aprobacion: $aprobacion, estado: $estado, fecha: $fecha, usuario_id: $usuario_id, codigo_cotizacion: $codigo_cotizacion) {
      id
    codigo_cotizacion
    usuario_id {
     id
     nombres
     apellidos
     rol_id
    }
    solicitud_compra_id {
     id
    
     fecha
    }
    aprobacion
    estado
    fecha
  }
}
`;

const DELETE_COTIZACION_MUTATION = gql`
  mutation DeleteCotizacion($deleteCotizacionId: ID!) {
    deleteCotizacion(id: $deleteCotizacionId) {
      id
    }
  }
`;

export const listCotizacionesService = async () => {
  try {
    const response = await client.query({
      query: LIST_COTIZACIONES_QUERY,
    });
    return response.data.listCotizaciones;
  } catch (error) {
    throw new Error(`Error fetching cotizaciones: ${error}`);
  }
};

export const getCotizacionService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_COTIZACION_QUERY,
      variables: { getCotizacionId: id },
    });
    return response.data.getCotizacion;
  } catch (error) {
    throw new Error(`Error fetching cotización: ${error}`);
  }
};

export const addCotizacionService = async (data: { 
  usuario_id: string; 
  codigo_cotizacion: string; 
  estado: string; 
  fecha: string;
  aprobacion: boolean;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_COTIZACION_MUTATION,
      variables: data,
    });
    return response.data.addCotizacion;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error adding cotización: ${error.message}`);
    }
    throw error;
  }
};

export const updateCotizacionService = async (data: {
  id: string;
  solicitud_compra_id?: string;
  aprobacion?: boolean;
  estado?: string;
  fecha?: Date;
  usuario_id?: string;
  codigo_cotizacion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_COTIZACION_MUTATION,
      variables: data,
    });
    return response.data.updateCotizacion;
  } catch (error) {
    throw new Error(`Error updating cotización: ${error}`);
  }
};

export const deleteCotizacionService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COTIZACION_MUTATION,
      variables: { deleteCotizacionId: id },
    });
    return response.data.deleteCotizacion;
  } catch (error) {
    throw new Error(`Error deleting cotización: ${error}`);
  }
};
