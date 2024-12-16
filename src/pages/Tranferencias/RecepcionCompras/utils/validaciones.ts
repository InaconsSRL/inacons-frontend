export interface ValidationError {
    field: string;
    message: string;
    type?: 'error' | 'warning';
}

export const validateCantidad = (cantidadRecibida: number, cantidadOrden: number, nombreRecurso: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (cantidadRecibida < 0) {
        errors.push({
            field: 'cantidad',
            message: `La cantidad no puede ser negativa para ${nombreRecurso}`,
            type: 'error'
        });
    }

    if (cantidadRecibida > cantidadOrden) {
        errors.push({
            field: 'cantidad',
            message: `La cantidad recibida (${cantidadRecibida}) no puede ser mayor a la cantidad ordenada (${cantidadOrden}) para ${nombreRecurso}`,
            type: 'error'
        });
    }

    if (cantidadRecibida < cantidadOrden) {
        errors.push({
            field: 'cantidad',
            message: `Recepción parcial: Faltan ${cantidadOrden - cantidadRecibida} unidades de ${nombreRecurso}`,
            type: 'warning'
        });
    }

    return errors;
};

export const validateFecha = (fechaRecepcion: string, fechaOrden: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const fechaRecepcionDate = new Date(fechaRecepcion);
    const fechaOrdenDate = new Date(fechaOrden);
    const hoy = new Date();

    // Eliminar la hora para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    fechaRecepcionDate.setHours(0, 0, 0, 0);
    fechaOrdenDate.setHours(0, 0, 0, 0);

    if (fechaRecepcionDate > hoy) {
        errors.push({
            field: 'fecha',
            message: 'La fecha de recepción no puede ser futura',
            type: 'error'
        });
    }

    if (fechaRecepcionDate < fechaOrdenDate) {
        errors.push({
            field: 'fecha',
            message: 'La fecha de recepción no puede ser anterior a la fecha de la orden',
            type: 'error'
        });
    }

    return errors;
};

export const validateTransporte = (movilidadId: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!movilidadId) {
        errors.push({
            field: 'movilidad',
            message: 'Debe seleccionar un tipo de transporte',
            type: 'error'
        });
    }

    return errors;
};

export const validateRecursos = (detalles: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const algunaCantidad = detalles.some(detalle => detalle.cantidadRecibida > 0);
    if (!algunaCantidad) {
        errors.push({
            field: 'recursos',
            message: 'Debe ingresar al menos una cantidad',
            type: 'error'
        });
    }

    // Validar cada recurso
    detalles.forEach((detalle, index) => {
        const cantidadErrors = validateCantidad(
            detalle.cantidadRecibida, 
            detalle.cantidad,
            detalle.id_recurso.nombre
        );
        
        cantidadErrors.forEach(error => {
            errors.push({
                ...error,
                field: `cantidad_${index}`,
            });
        });
    });

    return errors;
};

export const validateAll = (
    detalles: any[],
    fechaRecepcion: string,
    fechaOrden: string,
    movilidadId: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validar transporte
    errors.push(...validateTransporte(movilidadId));

    // Validar fecha
    errors.push(...validateFecha(fechaRecepcion, fechaOrden));

    // Validar recursos y cantidades
    errors.push(...validateRecursos(detalles));

    return errors;
};
