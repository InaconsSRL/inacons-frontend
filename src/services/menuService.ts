import { gql } from '@apollo/client';
import client from '../apolloClient';

const LIST_MENU_QUERY = gql`
  query ListMenus {
    listMenus {
      id
      nombre
      slug
      posicion
    }
  }
`;

const ADD_MENU_MUTATION = gql`
  mutation AddMenu($nombre: String!, $slug: String, $posicion: Int) {
    addMenu(nombre: $nombre, slug: $slug, posicion: $posicion) {
      id
      nombre
      slug
      posicion
    }
  }
`;

const UPDATE_MENU_MUTATION = gql`
  mutation UpdateMenu($updateMenuId: ID!, $nombre: String!, $slug: String, $posicion: Int) {
    updateMenu(id: $updateMenuId, nombre: $nombre, slug: $slug, posicion: $posicion) {
      id
      nombre
      slug
      posicion
    }
  }
`;

export const listMenusService = async () => {
  try {
    const response = await client.query({
      query: LIST_MENU_QUERY,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    
    return response.data.listMenus;
  } catch (error) {
    console.error('Error al obtener la lista de menús:', error);
    throw error;
  }
};

export const addMenuService = async (menuData: { nombre: string; slug: string; posicion: number }) => {
  try {
    const response = await client.mutate({
      mutation: ADD_MENU_MUTATION,
      variables: menuData,
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.addMenu;
  } catch (error) {
    console.error('Error al crear el menú:', error);
    throw error;
  }
};

export const updateMenuService = async (menu: { id: string; nombre: string; slug: string; posicion: number }) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_MENU_MUTATION,
      variables: { updateMenuId: menu.id, ...menu },
    });
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'Error desconocido');
    }
    return response.data.updateMenu;
  } catch (error) {
    console.error('Error al actualizar el menú:', error);
    throw error;
  }
};