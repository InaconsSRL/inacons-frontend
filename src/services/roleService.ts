import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_ROLES_AND_MENUS_QUERY = gql`
  query ListRolesAndMenus {
    listRoles {
      id
      nombre
      descripcion
      menusPermissions {
        menuID
        permissions {
          ver
          crear
          editar
          eliminar
        }
      }
    }
    listMenus {
      id
      nombre
      slug
      posicion
    }
  }
`;

const ADD_ROLE_MUTATION = gql`
  mutation addRole($nombre: String!, $descripcion: String!, $menusPermissions: [MenuPermissionInput!]!) {
    addRole(nombre: $nombre, descripcion: $descripcion, menusPermissions: $menusPermissions) {
      id
      nombre
      descripcion
      menusPermissions {
        menuID
        permissions {
          ver
          crear
          editar
          eliminar
        }
      }
    }
  }
`;

const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($updateRoleId: ID!, $nombre: String!, $descripcion: String!, $menusPermissions: [MenuPermissionInput!]!) {
    updateRole(id: $updateRoleId, nombre: $nombre, descripcion: $descripcion, menusPermissions: $menusPermissions) {
      id
      nombre
      descripcion
      menusPermissions {
        menuID
        permissions {
          ver
          crear
          editar
          eliminar
        }
      }
    }
  }
`;

export const listRolesAndMenusService = async () => {
  try {
    const response = await client.query({
      query: LIST_ROLES_AND_MENUS_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de roles y menús:', error);
    throw error;
  }
};

export const addRoleService = async (roleData: { nombre: string; descripcion: string; menusPermissions: any[] }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_ROLE_MUTATION,
      variables: roleData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addRole;
  } catch (error) {
    console.error('Error al crear el rol:', error);
    throw error;
  }
};

export const updateRoleService = async (role: { id: string; nombre: string; descripcion: string; menusPermissions: any[] }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ROLE_MUTATION,
      variables: { updateRoleId: role.id, ...role },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateRole;
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    throw error;
  }
};