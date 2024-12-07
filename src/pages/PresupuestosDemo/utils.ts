import dataBase from './data.json';
import { DataBase, Composicion } from './types';

export const db = dataBase as unknown as DataBase;

export const getAbreviaturaUnidad = (id_unidad: string) => {
    const unidadEncontrada = db.unidad.find(u => u.id_unidad === id_unidad);
    return unidadEncontrada?.abreviatura_unidad || id_unidad;
};

export const buscarComposicionesParaCostoUnitario = (idCostoUnitario: string): Composicion[] => {
    const subtotalesRelacionados = db.subtotal_costounitario.filter(
        subtotal => subtotal.id_costounitario === idCostoUnitario
    );

    const composicionesRelacionadas = subtotalesRelacionados.flatMap(subtotal => {
        return db.composicion_costounitario
            .filter(composicion => composicion.id_subtotal === subtotal.id_subtotal)
            .map(comp => ({
                ...comp,
                magnitud_unidadcomposicion: comp.magnitud_unidadcomposicion || 0
            }));
    });

    return composicionesRelacionadas;
};