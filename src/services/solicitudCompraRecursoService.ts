import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_SOLICITUD_COMPRA_RECURSOS = gql`
  query ListSolicitudCompraRecursos {
    listSolicitudCompraRecursos {
      id    
      solicitud_compra_id
      cantidad
      costo
      recurso_id {
        codigo
        nombre
        descripcion
        precio_actual
        vigente
        imagenes {
          file
        }
      }
    }
  }
`;

const LIST_BY_SOLICITUD_ID = gql`
  query ListSolicitudCompraRecursosBySolicitudId($solicitudCompraId: ID!) {
    listSolicitudCompraRecursosBySolicitudId(solicitud_compra_id: $solicitudCompraId) {
      id    
      solicitud_compra_id
      cantidad
      costo
      recurso_id {
        codigo
        nombre
        descripcion
        precio_actual
        vigente
        imagenes {
          file
        }
      }
    }
  }
`;

const ADD_SOLICITUD_COMPRA_RECURSO = gql`
  mutation AddSolicitudCompraRecurso($solicitudCompraId: ID!, $recursoId: ID!, $cantidad: Int!, $costo: Float!) {
    addSolicitudCompraRecurso(solicitud_compra_id: $solicitudCompraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo) {
      id    
      solicitud_compra_id
      cantidad
      costo
      recurso_id {
        codigo
        nombre
        descripcion
        precio_actual
        vigente
        imagenes {
          file
        }
      }
    }
  }
`;

const UPDATE_SOLICITUD_COMPRA_RECURSO = gql`
  mutation UpdateSolicitudCompraRecurso($updateSolicitudCompraRecursoId: ID!, $solicitudCompraId: ID, $recursoId: ID, $cantidad: Int, $costo: Float) {
    updateSolicitudCompraRecurso(id: $updateSolicitudCompraRecursoId, solicitud_compra_id: $solicitudCompraId, recurso_id: $recursoId, cantidad: $cantidad, costo: $costo) {
      id    
      solicitud_compra_id
      cantidad
      costo
      recurso_id {
        codigo
        nombre
        descripcion
        precio_actual
        vigente
        imagenes {
          file
        }
      }
    }
  }
`;

const DELETE_SOLICITUD_COMPRA_RECURSO = gql`
  mutation DeleteSolicitudCompraRecurso($deleteSolicitudCompraRecursoId: ID!) {
    deleteSolicitudCompraRecurso(id: $deleteSolicitudCompraRecursoId) {
      id
    }
  }
`;

export const listSolicitudCompraRecursosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_SOLICITUD_COMPRA_RECURSOS,
    });
    return data.listSolicitudCompraRecursos;
  } catch (error) {
    throw new Error(`Error fetching solicitud compra recursos: ${error}`);
  }
};

export const listBySolicitudIdService = async (solicitudCompraId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_BY_SOLICITUD_ID,
      variables: { solicitudCompraId },
    });
    return data.listSolicitudCompraRecursosBySolicitudId;
  } catch (error) {
    throw new Error(`Error fetching recursos by solicitud ID: ${error}`);
  }
};

export const addSolicitudCompraRecursoService = async (data: {
  solicitud_compra_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SOLICITUD_COMPRA_RECURSO,
      variables: {
        solicitudCompraId: data.solicitud_compra_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
      },
    });
    return response.data.addSolicitudCompraRecurso;
  } catch (error) {
    throw new Error(`Error adding solicitud compra recurso: ${error}`);
  }
};

export const updateSolicitudCompraRecursoService = async (data: {
  id: string;
  solicitud_compra_id?: string;
  recurso_id?: string;
  cantidad?: number;
  costo?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_SOLICITUD_COMPRA_RECURSO,
      variables: {
        updateSolicitudCompraRecursoId: data.id,
        solicitudCompraId: data.solicitud_compra_id,
        recursoId: data.recurso_id,
        cantidad: data.cantidad,
        costo: data.costo,
      },
    });
    return response.data.updateSolicitudCompraRecurso;
  } catch (error) {
    throw new Error(`Error updating solicitud compra recurso: ${error}`);
  }
};

export const deleteSolicitudCompraRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_SOLICITUD_COMPRA_RECURSO,
      variables: { deleteSolicitudCompraRecursoId: id },
    });
    return response.data.deleteSolicitudCompraRecurso;
  } catch (error) {
    throw new Error(`Error deleting solicitud compra recurso: ${error}`);
  }
};