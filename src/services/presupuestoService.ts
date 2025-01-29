import { gql } from '@apollo/client';
import client from '../apolloClient';
import { Presupuesto, CreatePresupuestoInput } from '../slices/presupuestoSlice';

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
  query GetPresupuesto($id_presupuesto: String!) {
    getPresupuesto(id_presupuesto: $id_presupuesto) {
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
  query GetPresupuestosByProyecto($id_proyecto: String!) {
    getPresupuestosByProyecto(id_proyecto: $id_proyecto) {
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
  mutation AddPresupuesto($id_proyecto: String!, $costo_directo: Float!, $monto_igv: Float!, $monto_utilidad: Float!, $parcial_presupuesto: Float!, $observaciones: String!, $porcentaje_igv: Float!, $porcentaje_utilidad: Float!, $plazo: Int!, $ppto_base: Float!, $ppto_oferta: Float!, $total_presupuesto: Float!, $nombre_presupuesto: String!, $numeracion_presupuesto: Int) {
    addPresupuesto(id_proyecto: $id_proyecto, costo_directo: $costo_directo, monto_igv: $monto_igv, monto_utilidad: $monto_utilidad, parcial_presupuesto: $parcial_presupuesto, observaciones: $observaciones, porcentaje_igv: $porcentaje_igv, porcentaje_utilidad: $porcentaje_utilidad, plazo: $plazo, ppto_base: $ppto_base, ppto_oferta: $ppto_oferta, total_presupuesto: $total_presupuesto, nombre_presupuesto: $nombre_presupuesto, numeracion_presupuesto: $numeracion_presupuesto) {
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
  mutation UpdatePresupuesto($id_presupuesto: String!, $nombre_presupuesto: String, $costo_directo: Float, $monto_igv: Float, $monto_utilidad: Float, $total_presupuesto: Float, $ppto_oferta: Float, $ppto_base: Float, $porcentaje_utilidad: Float, $porcentaje_igv: Float, $observaciones: String, $plazo: Int) {
    updatePresupuesto(id_presupuesto: $id_presupuesto, nombre_presupuesto: $nombre_presupuesto, costo_directo: $costo_directo, monto_igv: $monto_igv, monto_utilidad: $monto_utilidad, total_presupuesto: $total_presupuesto, ppto_oferta: $ppto_oferta, ppto_base: $ppto_base, porcentaje_utilidad: $porcentaje_utilidad, porcentaje_igv: $porcentaje_igv, observaciones: $observaciones, plazo: $plazo) {
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
  mutation DeletePresupuesto($id_presupuesto: String!) {
    deletePresupuesto(id_presupuesto: $id_presupuesto) {
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
      variables: { id_presupuesto: id },
    });
    return response.data.getPresupuesto;
  } catch (error) {
    throw new Error(`Error fetching presupuesto: ${error}`);
  }
};

export const getPresupuestosByProyectoService = async (id_proyecto: string) => {
  try {
    const response = await client.query({
      query: GET_PRESUPUESTOS_BY_PROYECTO_QUERY,
      variables: { id_proyecto },
    });
    return response.data.getPresupuestosByProyecto;
  } catch (error) {
    throw new Error(`Error fetching presupuestos by proyecto: ${error}`);
  }
};

export const addPresupuestoService = async (data: CreatePresupuestoInput) => {
  try {
    const response = await client.mutate({
      mutation: ADD_PRESUPUESTO_MUTATION,
      variables: {
        id_proyecto: data.id_proyecto,
        costo_directo: parseFloat(data.costo_directo.toString()),
        monto_igv: parseFloat(data.monto_igv.toString()),
        monto_utilidad: parseFloat(data.monto_utilidad.toString()),
        parcial_presupuesto: parseFloat(data.parcial_presupuesto.toString()),
        observaciones: data.observaciones,
        porcentaje_igv: parseFloat(data.porcentaje_igv.toString()),
        porcentaje_utilidad: parseFloat(data.porcentaje_utilidad.toString()),
        plazo: parseInt(data.plazo.toString()),
        ppto_base: parseFloat(data.ppto_base.toString()),
        ppto_oferta: parseFloat(data.ppto_oferta.toString()),
        total_presupuesto: parseFloat(data.total_presupuesto.toString()),
        nombre_presupuesto: data.nombre_presupuesto,
        numeracion_presupuesto: parseInt(data.numeracion_presupuesto.toString())
      }
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
      variables: {
        id_presupuesto: data.id_presupuesto,
        nombre_presupuesto: data.nombre_presupuesto,
        costo_directo: parseFloat(data.costo_directo.toString()),
        monto_igv: parseFloat(data.monto_igv.toString()),
        monto_utilidad: parseFloat(data.monto_utilidad.toString()),
        total_presupuesto: parseFloat(data.total_presupuesto.toString()),
        ppto_oferta: parseFloat(data.ppto_oferta.toString()),
        ppto_base: parseFloat(data.ppto_base.toString()),
        porcentaje_utilidad: parseFloat(data.porcentaje_utilidad.toString()),
        porcentaje_igv: parseFloat(data.porcentaje_igv.toString()),
        observaciones: data.observaciones,
        numeracion_presupuesto: parseInt(data.numeracion_presupuesto.toString()),
        plazo: parseInt(data.plazo.toString())
      }
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
      variables: { id_presupuesto: id },
    });
    return response.data.deletePresupuesto;
  } catch (error) {
    throw new Error(`Error deleting presupuesto: ${error}`);
  }
};
