import { gql } from '@apollo/client';
import client from '../apolloClient';

export const LIST_ROLES_AND_MENUS_QUERY = gql`
  query ListRolesAndMenus {
    listRoles {
      id
      nombre
      descripcion
      menusPermissions {
        menuID {
          id
          nombre
          slug
          posicion
        }
        permissions {
          ver
          crear
          editar
          eliminar
        }
      }
      createdAt
      updatedAt
      deleted
    }
    listMenus {
      id
      nombre
      slug
      posicion
    }
  }
`;

export const ADD_ROLE_MUTATION = gql`
  mutation AddRole($nombre: String!, $descripcion: String!, $menusPermissions: [MenuPermissionInput!]!) {
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
      createdAt
      updatedAt
      deleted
    }
  }
`;

export const UPDATE_ROLE_MUTATION = gql`
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
      createdAt
      updatedAt
      deleted
    }
  }
`;

interface MenuPermissionInput {
  menuID: string;
  permissions: {
    ver: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
}

interface RoleInput {
  nombre: string;
  descripcion: string;
  menusPermissions: MenuPermissionInput[];
}

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

export const addRoleService = async (roleData: RoleInput) => {
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

export const updateRoleService = async (id: string, roleData: RoleInput) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_ROLE_MUTATION,
      variables: {
        updateRoleId: id,
        ...roleData,
      },
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