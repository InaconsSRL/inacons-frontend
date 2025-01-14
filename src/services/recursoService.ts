import { gql } from '@apollo/client';
import client from '../apolloClient';
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI;

export const LIST_RECURSOS_QUERY = gql`
  query ListRecurso {
  listRecurso {
    id
    codigo
    nombre
    descripcion
    cantidad
    unidad_id
    precio_actual
    tipo_recurso_id
    tipo_costo_recurso_id
    clasificacion_recurso_id
    fecha
    vigente
    imagenes {
      id
      file
    }
  }
   
}
`;
export const LIST_DATA_QUERY = gql`
  query ListRecurso {
  listTipoRecurso {
    id
    nombre
  }
  listUnidad {
    id
    nombre
  }
  listClasificacionRecurso {
    id
    nombre
    parent_id
    childs {
      id
    nombre
    parent_id
    childs {
      id
    nombre
    parent_id
    }
    }
  }
    listTipoCostoRecurso {
      id
      nombre
    } 
   
}
`;
export const ADD_RECURSO_MUTATION = gql`
  mutation AddRecurso($nombre: String!, $unidad_id: String!, $tipo_recurso_id: String!, $tipo_costo_recurso_id: String!, $clasificacion_recurso_id: String!, $descripcion: String, $precio_actual: Float, $vigente: Boolean) {
  addRecurso(nombre: $nombre, unidad_id: $unidad_id, tipo_recurso_id: $tipo_recurso_id, tipo_costo_recurso_id: $tipo_costo_recurso_id, clasificacion_recurso_id: $clasificacion_recurso_id, descripcion: $descripcion, precio_actual: $precio_actual, vigente: $vigente) {
    id
    codigo
    nombre
    descripcion
    cantidad
    unidad_id
    precio_actual
    tipo_recurso_id
    tipo_costo_recurso_id
    clasificacion_recurso_id
    fecha
    vigente
    imagenes {
      id
      file
    }

  }
}
`;

export const UPDATE_RECURSO_MUTATION = gql`
  mutation UpdateRecurso($id: ID!, $codigo: String, $nombre: String, $descripcion: String, $unidad_id: String, $precio_actual: Float, $vigente: Boolean, $tipo_recurso_id: String, $tipo_costo_recurso_id: String, $clasificacion_recurso_id: String) {
  updateRecurso(id: $id, codigo: $codigo, nombre: $nombre, descripcion: $descripcion, unidad_id: $unidad_id, precio_actual: $precio_actual, vigente: $vigente, tipo_recurso_id: $tipo_recurso_id, tipo_costo_recurso_id: $tipo_costo_recurso_id, clasificacion_recurso_id: $clasificacion_recurso_id) {
    id
    codigo
    nombre
    descripcion
    cantidad
    unidad_id
    precio_actual
    tipo_recurso_id
    tipo_costo_recurso_id
    clasificacion_recurso_id
    fecha
    vigente
    imagenes {
      id
      file
    }
  }
}
`;

export const DELETE_IMAGEN_RECURSO_MUTATION = gql`
  mutation DeleteImagenRecurso($id: ID!) {
    deleteImagenRecurso(id: $id) {
      id
      recurso_id
      file
      fecha
    }
  }
`;

export const UPLOAD_IMAGEN_RECURSO_MUTATION = gql`
  mutation UploadImagenRecurso($recursoId: ID!, $files: [Upload!]!) {
    uploadImagenRecurso(recursoId: $recursoId, files: $files) {
    id
    file
    recurso_id
    fecha
    }
  }
`;

interface AddRecursoInput {
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad_id: string;
  precio_actual: number;
  tipo_recurso_id: string;
  clasificacion_recurso_id: string;
  vigente: boolean;
  tipo_costo_recurso_id?: string;
}

interface UpdateRecursoInput {
  id: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  unidad_id?: string;
  precio_actual?: number;
  tipo_recurso_id?: string;
  clasificacion_recurso_id?: string;
  vigente: boolean;
  tipo_costo_recurso_id?: string;
}

interface ListDataQueryResult {
  listTipoRecurso: Array<{
    id: string;
    nombre: string;
  }>;
  listUnidad: Array<{
    id: string;
    nombre: string;
  }>;
  listClasificacionRecurso: Array<{
    id: string;
    nombre: string;
    parent_id: string | null;
    childs: Array<{
      nombre: string;
      id: string;
      parent_id: string;
    }>;
  }>;
  listTipoCostoRecurso: Array<{
    id: string;
    nombre: string;
  }>;
}

interface ImagenRecursoResponse {
  id: string;
  file: string;
  recurso_id: string;
  fecha: string;

}

export const listRecursosService = async () => {
  try {
    const response = await client.query({
      query: LIST_RECURSOS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.listRecurso;

  } catch (error) {
    console.error('Error al obtener la lista de recursos:', error);
    throw error;
  }
};

export const listDataService = async (): Promise<ListDataQueryResult> => {
  try {
    const response = await client.query({
      query: LIST_DATA_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de las listas:', error);
    throw error;
  }
};

export const addRecursoService = async (recursoData: AddRecursoInput) => {
  try {
    const response = await client.mutate({
      mutation: ADD_RECURSO_MUTATION,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addRecurso;
  } catch (error) {
    console.error('Error al crear el recurso:', error);
    throw error;
  }
};

export const updateRecursoService = async (recursoData: UpdateRecursoInput) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_RECURSO_MUTATION,
      variables: recursoData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateRecurso;
  } catch (error) {
    console.error('Error al actualizar el recurso:', error);
    throw error;
  }
};

export const deleteImagenRecursoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_IMAGEN_RECURSO_MUTATION,
      variables: { id },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.deleteImagenRecurso;
  } catch (error) {
    console.error('Error al eliminar la imagen del recurso:', error);
    throw error;
  }
};

export const uploadImagenRecursoService = async (recursoId: string, file: File): Promise<ImagenRecursoResponse> => {
  try {
    // Crear FormData
    const formDataForUpload = new FormData();
    
    // Añadir la operación GraphQL
    formDataForUpload.append('operations', JSON.stringify({
      query: UPLOAD_IMAGEN_RECURSO_MUTATION.loc?.source.body,
      variables: {
        recursoId,
        files: [null]
      }
    }));

    // Añadir el map para el archivo
    formDataForUpload.append('map', JSON.stringify({ "0": ["variables.files.0"] }));
    
    // Añadir el archivo
    formDataForUpload.append('0', file);

    // Hacer la petición directamente al endpoint
    const response = await fetch(GRAPHQL_URI, {
      method: 'POST',
      body: formDataForUpload,
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Error desconocido');
    }

    return result.data.uploadImagenRecurso[0];
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};