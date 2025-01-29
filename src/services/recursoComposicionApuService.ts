import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_RECURSOS_COMPOSICION_APU_QUERY = gql`
  query ListRecursosComposicionApu {
    listRecursosComposicionApu {
      id_rec_comp_apu
      id_recurso
      nombre
      especificaciones
      descripcion
      fecha_creacion
      recurso_presupuesto {
        nombre
        id_recurso
        id_unidad
      }
      unidad_presupuesto {
        id_unidad
        descripcion
        abreviatura_unidad
      }
    }
  }
`;

const GET_RECURSO_COMPOSICION_APU_QUERY = gql`
  query GetRecursoComposicionApu($id_rec_comp_apu: String!) {
    getRecursoComposicionApu(id_rec_comp_apu: $id_rec_comp_apu) {
      id_rec_comp_apu
      id_recurso
      nombre
      especificaciones
      descripcion
      fecha_creacion
      recurso_presupuesto {
        nombre
        id_recurso
        id_unidad
      }
      unidad_presupuesto {
        id_unidad
        descripcion
        abreviatura_unidad
      }
    }
  }
`;

const ADD_RECURSO_COMPOSICION_APU_MUTATION = gql`
  mutation AddRecursoComposicionApu(
    $id_recurso: String!
    $id_unidad: String!
    $nombre: String!
    $especificaciones: String
    $descripcion: String
  ) {
    addRecursoComposicionApu(
      id_recurso: $id_recurso
      id_unidad: $id_unidad
      nombre: $nombre
      especificaciones: $especificaciones
      descripcion: $descripcion
    ) {
      id_rec_comp_apu
      nombre
      especificaciones
      descripcion
      fecha_creacion
      recurso_presupuesto {
        nombre
        id_recurso
        id_unidad
      }
      unidad_presupuesto {
        id_unidad
        abreviatura_unidad
        descripcion
      }
    }
  }
`;

const UPDATE_RECURSO_COMPOSICION_APU_MUTATION = gql`
  mutation UpdateRecursoComposicionApu(
    $id_rec_comp_apu: String!
    $id_recurso: String
    $id_unidad: String
    $nombre: String
    $especificaciones: String
    $descripcion: String
  ) {
    updateRecursoComposicionApu(
      id_rec_comp_apu: $id_rec_comp_apu
      id_recurso: $id_recurso
      id_unidad: $id_unidad
      nombre: $nombre
      especificaciones: $especificaciones
      descripcion: $descripcion
    ) {
      id_rec_comp_apu
      nombre
      especificaciones
      descripcion
      fecha_creacion
      recurso_presupuesto {
        nombre
        id_recurso
      }
      unidad_presupuesto {
        id_unidad
        abreviatura_unidad
        descripcion
      }
    }
  }
`;

const DELETE_RECURSO_COMPOSICION_APU_MUTATION = gql`
  mutation DeleteRecursoComposicionApu($id_rec_comp_apu: String!) {
    deleteRecursoComposicionApu(id_rec_comp_apu: $id_rec_comp_apu) {
      id_rec_comp_apu
    }
  }
`;

export const listRecursosComposicionApuService = async () => {
  try {
    const response = await client.query({
      query: LIST_RECURSOS_COMPOSICION_APU_QUERY,
    });
    return response.data.listRecursosComposicionApu;
  } catch (error) {
    throw new Error(`Error fetching recursos composición APU: ${error}`);
  }
};

export const getRecursoComposicionApuService = async (id_rec_comp_apu: string) => {
  try {
    const response = await client.query({
      query: GET_RECURSO_COMPOSICION_APU_QUERY,
      variables: { id_rec_comp_apu },
    });
    return response.data.getRecursoComposicionApu;
  } catch (error) {
    throw new Error(`Error fetching recurso composición APU: ${error}`);
  }
};

export const addRecursoComposicionApuService = async (data: {
  id_recurso: string;
  id_unidad: string;
  nombre: string;
  especificaciones?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_RECURSO_COMPOSICION_APU_MUTATION,
      variables: data,
    });
    return response.data.addRecursoComposicionApu;
  } catch (error) {
    throw new Error(`Error adding recurso composición APU: ${error}`);
  }
};

export const updateRecursoComposicionApuService = async (data: {
  id_rec_comp_apu: string;
  id_recurso?: string;
  id_unidad?: string;
  nombre?: string;
  especificaciones?: string;
  descripcion?: string;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_RECURSO_COMPOSICION_APU_MUTATION,
      variables: data,
    });
    return response.data.updateRecursoComposicionApu;
  } catch (error) {
    throw new Error(`Error updating recurso composición APU: ${error}`);
  }
};

export const deleteRecursoComposicionApuService = async (id_rec_comp_apu: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_RECURSO_COMPOSICION_APU_MUTATION,
      variables: { id_rec_comp_apu },
    });
    return response.data.deleteRecursoComposicionApu;
  } catch (error) {
    throw new Error(`Error deleting recurso composición APU: ${error}`);
  }
};
