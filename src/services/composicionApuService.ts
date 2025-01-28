import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_COMPOSICIONES_APU_BY_TITULO_QUERY = gql`
  query GetComposicionesApuByTitulo($idTitulo: String!) {
    getComposicionesApuByTitulo(id_titulo: $idTitulo) {
      rec_comp_apu {
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
        precio_recurso_proyecto {
          id_prp
          id_proyecto
          id_rec_comp_apu
          precio
          fecha_creacion
        }
      }
      cuadrilla
      cantidad
      fecha_creacion
      id_composicion_apu
      id_titulo
    }
  }
`;

const ADD_COMPOSICION_APU_MUTATION = gql`
  mutation AddComposicionApu($idTitulo: String!, $idRecCompApu: String!, $cuadrilla: Float!, $cantidad: Float!) {
    addComposicionApu(id_titulo: $idTitulo, id_rec_comp_apu: $idRecCompApu, cuadrilla: $cuadrilla, cantidad: $cantidad) {
      id_composicion_apu
      id_titulo
      id_rec_comp_apu
      cuadrilla
      cantidad
      fecha_creacion
    }
  }
`;

const UPDATE_COMPOSICION_APU_MUTATION = gql`
  mutation UpdateComposicionApu($idComposicionApu: String!, $idRecCompApu: String, $cuadrilla: Float, $cantidad: Float) {
    updateComposicionApu(id_composicion_apu: $idComposicionApu, id_rec_comp_apu: $idRecCompApu, cuadrilla: $cuadrilla, cantidad: $cantidad) {
      id_composicion_apu
      id_titulo
      id_rec_comp_apu
      cuadrilla
      cantidad
      fecha_creacion
    }
  }
`;

const DELETE_COMPOSICION_APU_MUTATION = gql`
  mutation DeleteComposicionApu($idComposicionApu: String!) {
    deleteComposicionApu(id_composicion_apu: $idComposicionApu) {
      id_composicion_apu
    }
  }
`;

export const getComposicionesApuByTituloService = async (idTitulo: string) => {
  try {
    const response = await client.query({
      query: GET_COMPOSICIONES_APU_BY_TITULO_QUERY,
      variables: { idTitulo },
    });
    return response.data.getComposicionesApuByTitulo;
  } catch (error) {
    throw new Error(`Error fetching composiciones APU: ${error}`);
  }
};

export const addComposicionApuService = async (data: {
  idTitulo: string;
  idRecCompApu: string;
  cuadrilla: number;
  cantidad: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: ADD_COMPOSICION_APU_MUTATION,
      variables: data,
    });
    return response.data.addComposicionApu;
  } catch (error) {
    throw new Error(`Error adding composición APU: ${error}`);
  }
};

export const updateComposicionApuService = async (data: {
  idComposicionApu: string;
  idRecCompApu?: string;
  cuadrilla?: number;
  cantidad?: number;
}) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_COMPOSICION_APU_MUTATION,
      variables: data,
    });
    return response.data.updateComposicionApu;
  } catch (error) {
    throw new Error(`Error updating composición APU: ${error}`);
  }
};

export const deleteComposicionApuService = async (idComposicionApu: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COMPOSICION_APU_MUTATION,
      variables: { idComposicionApu },
    });
    return response.data.deleteComposicionApu;
  } catch (error) {
    throw new Error(`Error deleting composición APU: ${error}`);
  }
};
