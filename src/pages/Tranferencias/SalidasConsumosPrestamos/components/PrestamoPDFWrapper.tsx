import React from 'react';
import { PrestamoPDFWrapperProps, PrestamoDocumentType } from './prestamoPDF.types';
import PrestamoPDFGenerator from './PrestamoPDFGenerator';

const PrestamoPDFWrapper: React.FC<PrestamoPDFWrapperProps> = ({
    recursosRetornables,
    empleadoData,
    almaceneroData,
    supervisorData,
    obraData,
    fechaRetorno,
}) => {

    // Transformar los datos al formato requerido por el generador de PDF
    const prestamoDocument: PrestamoDocumentType = {
        codigo: `PRESTAMO - ${obraData.nombre}`,
        fecha_emision: new Date(),
        fecha_retorno: fechaRetorno,
        obra: {
            id: obraData.id,
            nombre: obraData.nombre,
            ubicacion: obraData.ubicacion
        },
        almacenero: {
            id: almaceneroData.id,
            nombres: almaceneroData.nombres,
            apellidos: almaceneroData.apellidos,
            dni: almaceneroData.dni
        },
        empleado: {
            id: empleadoData.id,
            nombres: empleadoData.nombres,
            apellidos: empleadoData.apellidos,
            dni: empleadoData.dni
        },
        supervisor: {
            id: supervisorData.id,
            nombres: supervisorData.nombres,
            apellidos: supervisorData.apellidos
        },
        recursos: Object.values(
            recursosRetornables.reduce((acc, item) => {
                const key = item.recurso.recurso_id.id;
                if (!acc[key]) {
                    acc[key] = {
                        id: item.recurso.id,
                        recurso_id: {
                            id: item.recurso.recurso_id.id,
                            nombre: item.recurso.recurso_id.nombre,
                            codigo: item.recurso.recurso_id.codigo,
                            unidad_id: item.recurso.recurso_id.unidad_id
                        },
                        cantidad: 0,
                        estado: 'PRESTADO',
                        observaciones: [] // Cambiado a un array de observaciones
                    };
                }
                acc[key].cantidad += item.cantidad;
                if (item.observacion) {
                    acc[key].observaciones.push(item.observacion);
                }
                return acc;
            }, {} as Record<string, typeof prestamoDocument.recursos[0]>)
        ),
    };

    return <PrestamoPDFGenerator prestamo={prestamoDocument} />;
};

export default PrestamoPDFWrapper;