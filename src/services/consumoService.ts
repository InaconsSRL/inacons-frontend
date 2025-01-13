import { gql } from '@apollo/client';
import client from '../apolloClient';
import { ConsumoOutput, ConsumoInput, ConsumoUpdateInput } from '../slices/consumoSlice';

const LIST_CONSUMOS_QUERY = gql`
  query ListConsumos {
    listConsumos {
      id
      fecha
      almacenero_id {
        nombres
        apellidos
        id
      }
      responsable_id {
        nombres
        apellidos
        id
      }
      obra_id {
        id
        nombre
      }
      personal_id {
        id
        nombres
        apellidos
        telefono
        telefono_secundario
        dni
        cargo_id {
          id
          nombre
          descripcion
          gerarquia
        }
      }
      estado
      transferencia_detalle_id {
        id
        referencia_id
        referencia
      }
    }
  }
`;

const ADD_CONSUMO_MUTATION = gql`
  mutation AddConsumo(
    $fecha: Date!,
    $almaceneroId: ID!,
    $responsableId: ID!,
    $obraId: ID!,
    $personalId: String!,
    $estado: String!,
    $transferenciaDetalleId: ID!
  ) {
    addConsumo(
      fecha: $fecha,
      almacenero_id: $almaceneroId,
      responsable_id: $responsableId,
      obra_id: $obraId,
      personal_id: $personalId,
      estado: $estado,
      transferencia_detalle_id: $transferenciaDetalleId
    ) {
      id
      fecha
      almacenero_id {
        nombres
        apellidos
        id
      }
      responsable_id {
        nombres
        apellidos
        id
      }
      obra_id {
        id
        nombre
      }
      personal_id {
        id
        nombres
        apellidos
        telefono
        telefono_secundario
        dni
        cargo_id {
          id
          nombre
          descripcion
          gerarquia
        }
      }
      estado
      transferencia_detalle_id {
        id
        referencia_id
        referencia
      }
    }
  }
`;

const UPDATE_CONSUMO_MUTATION = gql`
  mutation UpdateConsumo(
    $updateConsumoId: ID!,
    $fecha: Date,
    $almaceneroId: String,
    $responsableId: String,
    $personalId: ID,
    $estado: String,
    $transferenciaDetalleId: ID,
    $obraId: ID
  ) {
    updateConsumo(
      id: $updateConsumoId,
      fecha: $fecha,
      almacenero_id: $almaceneroId,
      responsable_id: $responsableId,
      personal_id: $personalId,
      estado: $estado,
      transferencia_detalle_id: $transferenciaDetalleId,
      obra_id: $obraId
    ) {
      id
      fecha
      almacenero_id {
        nombres
        apellidos
        id
      }
      responsable_id {
        nombres
        apellidos
        id
      }
      obra_id {
        id
        nombre
      }
      personal_id {
        id
        nombres
        apellidos
        telefono
        telefono_secundario
        dni
        cargo_id {
          id
          nombre
          descripcion
          gerarquia
        }
      }
      estado
      transferencia_detalle_id {
        id
        referencia_id
        referencia
      }
    }
  }
`;

const DELETE_CONSUMO_MUTATION = gql`
  mutation DeleteConsumo($deleteConsumoId: ID!) {
    deleteConsumo(id: $deleteConsumoId) {
      id
    }
  }
`;

export const listConsumosService = async () => {
  try {
    const { data } = await client.query({
      query: LIST_CONSUMOS_QUERY,
    });
    return data.listConsumos as ConsumoOutput[];
  } catch (error) {
    throw new Error(`Error fetching consumos: ${error}`);
  }
};

export const addConsumoService = async (consumoData: ConsumoInput): Promise<ConsumoOutput> => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_CONSUMO_MUTATION,
      variables: consumoData,
    });
    return data.addConsumo;
  } catch (error) {
    throw new Error(`Error adding consumo: ${error}`);
  }
};

export const updateConsumoService = async (consumoData: ConsumoUpdateInput): Promise<ConsumoOutput> => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CONSUMO_MUTATION,
      variables: {
        updateConsumoId: consumoData.id,
        ...consumoData
      },
    });
    return data.updateConsumo;
  } catch (error) {
    throw new Error(`Error updating consumo: ${error}`);
  }
};

export const deleteConsumoService = async (id: string) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_CONSUMO_MUTATION,
      variables: { deleteConsumoId: id },
    });
    return data.deleteConsumo;
  } catch (error) {
    throw new Error(`Error deleting consumo: ${error}`);
  }
};
