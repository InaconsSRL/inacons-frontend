
import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ALMACEN_CENTRO_COSTOS = gql`
  query ListAlmacenCentroCostos {
    listAlmacenCentroCostos {
      id
      centro_costo_id
      almacen_id
      merma
      depreciacion
      otros
    }
  }
`;

const LIST_BY_ALMACEN_ID = gql`
  query ListAlmacenCentroCostosByAlmacenId($almacenId: ID!) {
    listAlmacenCentroCostosByAlmacenId(almacen_id: $almacenId) {
      id
      centro_costo_id
      almacen_id
      merma
      depreciacion
      otros
    }
  }
`;

const LIST_BY_CENTRO_COSTO_ID = gql`
  query ListAlmacenCentroCostosByCentroCostoId($centroCostoId: ID!) {
    listAlmacenCentroCostosByCentroCostoId(centro_costo_id: $centroCostoId) {
      id
      centro_costo_id
      almacen_id
      merma
      depreciacion
      otros
    }
  }
`;

const UPDATE_ALMACEN_CENTRO_COSTO = gql`
  mutation UpdateAlmacenCentroCosto(
    $updateAlmacenCentroCostoId: ID!,
    $centroCostoId: ID,
    $almacenId: ID,
    $merma: Float,
    $depreciacion: Float,
    $otros: Float
  ) {
    updateAlmacenCentroCosto(
      id: $updateAlmacenCentroCostoId,
      centro_costo_id: $centroCostoId,
      almacen_id: $almacenId,
      merma: $merma,
      depreciacion: $depreciacion,
      otros: $otros
    ) {
      id
      centro_costo_id
      almacen_id
      merma
      depreciacion
      otros
    }
  }
`;

const DELETE_ALMACEN_CENTRO_COSTO = gql`
  mutation DeleteAlmacenCentroCosto($deleteAlmacenCentroCostoId: ID!) {
    deleteAlmacenCentroCosto(id: $deleteAlmacenCentroCostoId) {
      id
    }
  }
`;

export const listAlmacenCentroCostos = async () => {
  try {
    const { data } = await client.query({
      query: LIST_ALMACEN_CENTRO_COSTOS,
    });
    return data.listAlmacenCentroCostos;
  } catch (error) {
    throw new Error(`Error fetching almacen centro costos: ${error}`);
  }
};

export const listAlmacenCentroCostosByAlmacenId = async (almacenId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_BY_ALMACEN_ID,
      variables: { almacenId },
    });
    return data.listAlmacenCentroCostosByAlmacenId;
  } catch (error) {
    throw new Error(`Error fetching by almacen ID: ${error}`);
  }
};

export const listAlmacenCentroCostosByCentroCostoId = async (centroCostoId: string) => {
  try {
    const { data } = await client.query({
      query: LIST_BY_CENTRO_COSTO_ID,
      variables: { centroCostoId },
    });
    return data.listAlmacenCentroCostosByCentroCostoId;
  } catch (error) {
    throw new Error(`Error fetching by centro costo ID: ${error}`);
  }
};

export const updateAlmacenCentroCosto = async (params: {
  id: string;
  centro_costo_id?: string;
  almacen_id?: string;
  merma?: number;
  depreciacion?: number;
  otros?: number;
}) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_ALMACEN_CENTRO_COSTO,
      variables: {
        updateAlmacenCentroCostoId: params.id,
        centroCostoId: params.centro_costo_id,
        almacenId: params.almacen_id,
        merma: params.merma,
        depreciacion: params.depreciacion,
        otros: params.otros,
      },
    });
    return data.updateAlmacenCentroCosto;
  } catch (error) {
    throw new Error(`Error updating almacen centro costo: ${error}`);
  }
};

export const deleteAlmacenCentroCosto = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_ALMACEN_CENTRO_COSTO,
      variables: { deleteAlmacenCentroCostoId: id },
    });
    return data.deleteAlmacenCentroCosto;
  } catch (error) {
    throw new Error(`Error deleting almacen centro costo: ${error}`);
  }
};