import { gql } from '@apollo/client';
import client from '../apolloClient';
import { Presupuesto } from '../slices/presupuestoSlice';

const LIST_PRESUPUESTOS_QUERY = gql`
  query ListPresupuestos {
    listPresupuestos {
      id_presupuesto
      id_proyecto
      costo_directo
      fecha_creacion
      monto_igv
      monto_utilidad
      nombre_presupuesto
      numeracion_presupuesto
      parcial_presupuesto
      observaciones
      porcentaje_igv
      porcentaje_utilidad
      plazo
      ppto_base
      ppto_oferta
      total_presupuesto
    }
  }
`;

const GET_PRESUPUESTO_QUERY = gql`
  query GetPresupuesto($idPresupuesto: String!) {
    getPresupuesto(id_presupuesto: $idPresupuesto) {
      id_presupuesto
      id_proyecto
      costo_directo
      fecha_creacion
      monto_igv
      monto_utilidad
      nombre_presupuesto
      numeracion_presupuesto
      parcial_presupuesto
      observaciones
      porcentaje_igv
      porcentaje_utilidad
      plazo
      ppto_base
      ppto_oferta
      total_presupuesto
    }
  }
`;

const GET_PRESUPUESTOS_BY_PROYECTO_QUERY = gql`
  query GetPresupuestosByProyecto($idProyecto: String!) {
    getPresupuestosByProyecto(id_proyecto: $idProyecto) {
      id_presupuesto
      id_proyecto
      fecha_creacion
      nombre_presupuesto
      ppto_base
      ppto_oferta
      total_presupuesto
      numeracion_presupuesto
    }
  }
`;

const ADD_PRESUPUESTO_MUTATION = gql`
  mutation AddPresupuesto($idProyecto: String!, $costoDirecto: Float!, $montoIgv: Float!, $montoUtilidad: Float!, $parcialPresupuesto: Float!, $observaciones: String!, $porcentajeIgv: Float!, $porcentajeUtilidad: Float!, $plazo: Int!, $pptoBase: Float!, $pptoOferta: Float!, $totalPresupuesto: Float!, $nombrePresupuesto: String!, $numeracionPresupuesto: Int) {
    addPresupuesto(id_proyecto: $idProyecto, costo_directo: $costoDirecto, monto_igv: $montoIgv, monto_utilidad: $montoUtilidad, parcial_presupuesto: $parcialPresupuesto, observaciones: $observaciones, porcentaje_igv: $porcentajeIgv, porcentaje_utilidad: $porcentajeUtilidad, plazo: $plazo, ppto_base: $pptoBase, ppto_oferta: $pptoOferta, total_presupuesto: $totalPresupuesto, nombre_presupuesto: $nombrePresupuesto, numeracion_presupuesto: $numeracionPresupuesto) {
      id_presupuesto
      id_proyecto
      costo_directo
      fecha_creacion
      monto_igv
      monto_utilidad
      nombre_presupuesto
      numeracion_presupuesto
      parcial_presupuesto
      observaciones
      porcentaje_igv
      porcentaje_utilidad
      plazo
      ppto_base
      ppto_oferta
      total_presupuesto
    }
  }
`;

const UPDATE_PRESUPUESTO_MUTATION = gql`
  mutation UpdatePresupuesto($idPresupuesto: String!, $nombrePresupuesto: String, $costoDirecto: Float, $montoIgv: Float, $montoUtilidad: Float, $totalPresupuesto: Float, $pptoOferta: Float, $pptoBase: Float, $porcentajeUtilidad: Float, $porcentajeIgv: Float, $observaciones: String, $plazo: Int) {
    updatePresupuesto(id_presupuesto: $idPresupuesto, nombre_presupuesto: $nombrePresupuesto, costo_directo: $costoDirecto, monto_igv: $montoIgv, monto_utilidad: $montoUtilidad, total_presupuesto: $totalPresupuesto, ppto_oferta: $pptoOferta, ppto_base: $pptoBase, porcentaje_utilidad: $porcentajeUtilidad, porcentaje_igv: $porcentajeIgv, observaciones: $observaciones, plazo: $plazo) {
      id_presupuesto
      id_proyecto
      costo_directo
      fecha_creacion
      monto_igv
      monto_utilidad
      nombre_presupuesto
      numeracion_presupuesto
      parcial_presupuesto
      observaciones
      porcentaje_igv
      porcentaje_utilidad
      plazo
      ppto_base
      ppto_oferta
      total_presupuesto
    }
  }
`;

const DELETE_PRESUPUESTO_MUTATION = gql`
  mutation DeletePresupuesto($idPresupuesto: String!) {
    deletePresupuesto(id_presupuesto: $idPresupuesto) {
      id_presupuesto
    }
  }
`;

export const listPresupuestosService = async () => {
  try {
    const response = await client.query({
      query: LIST_PRESUPUESTOS_QUERY,
    });
    return response.data.listPresupuestos;
  } catch (error) {
    throw new Error(`Error fetching presupuestos: ${error}`);
  }
};

export const getPresupuestoService = async (id: string) => {
  try {
    const response = await client.query({
      query: GET_PRESUPUESTO_QUERY,
      variables: { idPresupuesto: id },
    });
    return response.data.getPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching presupuesto: ${error}`);
  }
};

export const getPresupuestosByProyectoService = async (idProyecto: string) => {
  try {
    const response = await client.query({
      query: GET_PRESUPUESTOS_BY_PROYECTO_QUERY,
      variables: { idProyecto },
    });
    return response.data.getPresupuestosByProyecto;
  } catch (error) {
    throw new Error(`Error fetching presupuestos by proyecto: ${error}`);
  }
};

export const addPresupuestoService = async (data: Presupuesto) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.addPresupuesto;
  } catch (error) {
    throw new Error(`Error adding presupuesto: ${error}`);
  }
};

export const updatePresupuestoService = async (data: Presupuesto) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_PRESUPUESTO_MUTATION,
      variables: data,
    });
    return response.data.updatePresupuesto;
  } catch (error) {
    throw new Error(`Error updating presupuesto: ${error}`);
  }
};

export const deletePresupuestoService = async (id: string) => {
  try {
    const response = await client.mutate({
      mutation: DELETE_PRESUPUESTO_MUTATION,
      variables: { idPresupuesto: id },
    });
    return response.data.deletePresupuesto;
  } catch (error) {
    throw new Error(`Error deleting presupuesto: ${error}`);
  }
};
