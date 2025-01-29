import { gql } from '@apollo/client';
import client from '../apolloClient';

const GET_COMPOSICIONES_APU_BY_TITULO_QUERY = gql`
  query GetComposicionesApuByTitulo($id_titulo: String!, $id_proyecto: String!) {
    getComposicionesApuByTitulo(id_titulo: $id_titulo, id_proyecto: $id_proyecto) {
      id_composicion_apu
      id_titulo
      cuadrilla
      cantidad
      fecha_creacion
      rec_comp_apu {
        id_rec_comp_apu
        nombre
        descripcion
        especificaciones
        fecha_creacion
        unidad_presupuesto {
          id_unidad
          descripcion
          abreviatura_unidad
        }
        recurso_presupuesto {
          id_recurso
          id_tipo
          nombre
        }
        precio_recurso_proyecto {
          id_prp
          precio
          id_proyecto
          id_rec_comp_apu
        }
      }
    }
  }
`;

const ADD_COMPOSICION_APU_MUTATION = gql`
  mutation AddComposicionApu($id_titulo: String!, $id_rec_comp_apu: String!, $cuadrilla: Float!, $cantidad: Float!) {
    addComposicionApu(id_titulo: $id_titulo, id_rec_comp_apu: $id_rec_comp_apu, cuadrilla: $cuadrilla, cantidad: $cantidad) {
      id_composicion_apu
      id_titulo
      cuadrilla
      cantidad
      fecha_creacion
      rec_comp_apu {
        id_rec_comp_apu
        nombre
        especificaciones
        descripcion
        fecha_creacion
        recurso_presupuesto {
          id_recurso
          id_unidad
          id_clase
          id_tipo
          id_recurso_app
          nombre
          precio_referencial
          fecha_actualizacion
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
    }
  }
`;

const UPDATE_COMPOSICION_APU_MUTATION = gql`
  mutation UpdateComposicionApu($id_composicion_apu: String!, $id_rec_comp_apu: String, $cuadrilla: Float, $cantidad: Float) {
    updateComposicionApu(id_composicion_apu: $id_composicion_apu, id_rec_comp_apu: $id_rec_comp_apu, cuadrilla: $cuadrilla, cantidad: $cantidad) {
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
  mutation DeleteComposicionApu($id_composicion_apu: String!) {
    deleteComposicionApu(id_composicion_apu: $id_composicion_apu) {
      id_composicion_apu
    }
  }
`;

export const getComposicionesApuByTituloService = async (id_titulo: string, id_proyecto: string) => {
  try {
    console.log('🟡 Llamando a getComposicionesApuByTituloService con:', { id_titulo, id_proyecto });
    const { data } = await client.query({
      query: GET_COMPOSICIONES_APU_BY_TITULO_QUERY,
      variables: { id_titulo, id_proyecto },
      fetchPolicy: 'network-only' // Forzar a buscar desde el servidor
    });
    console.log('🟡 Respuesta de GET_COMPOSICIONES_APU_BY_TITULO_QUERY:', data);
    return data.getComposicionesApuByTitulo;
  } catch (error) {
    console.error('🔴 Error en getComposicionesApuByTituloService:', error);
    throw error;
  }
};

export const addComposicionApuService = async (data: {
  id_titulo: string;
  id_rec_comp_apu: string;
  cuadrilla: number;
  cantidad: number;
}) => {
  console.log('🟡 Llamando a addComposicionApuService con:', data);
  try {
    const response = await client.mutate({
      mutation: ADD_COMPOSICION_APU_MUTATION,
      variables: data,
      errorPolicy: 'all', // Importante: manejar errores sin romper la ejecución
    });

    if (response.errors) {
      // Si hay errores pero también datos, loggear el error pero continuar
      console.warn('⚠️ Advertencias en addComposicionApuService:', response.errors);
    }

    if (!response.data?.addComposicionApu) {
      throw new Error('No se recibieron datos de la mutación');
    }

    console.log('🟡 Respuesta de ADD_COMPOSICION_APU_MUTATION:', response.data);
    return response.data.addComposicionApu;
  } catch (error) {
    console.error('🔴 Error en addComposicionApuService:', error);
    throw error;
  }
};

export const updateComposicionApuService = async (data: {
  id_composicion_apu: string;
  id_rec_comp_apu?: string;
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

export const deleteComposicionApuService = async (id_composicion_apu: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_COMPOSICION_APU_MUTATION,
      variables: { id_composicion_apu },
    });
    return response.data.deleteComposicionApu;
  } catch (error) {
    throw new Error(`Error deleting composición APU: ${error}`);
  }
};
