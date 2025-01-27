export const calcularDescuento = (
    tipo: string,
    montoTotal: number,
    porcentaje: number
  ): number => {
    // Validaciones básicas
    if (montoTotal < 0 || porcentaje < 0) return 0;
    
    switch (tipo) {
      case 'detraccion':
        // La detracción solo aplica si el monto es mayor a 700 soles
        if (montoTotal <= 700) return 0;
        // Si no se especifica porcentaje, usar 12% por defecto
        const porcentajeDetraccion = porcentaje || 12;
        return Number((montoTotal * (porcentajeDetraccion / 100)).toFixed(2));
        
      case 'retencion':
        return Number((montoTotal * 0.03).toFixed(2));
        
      case 'pendiente':
        return montoTotal;
        
      default:
        return 0;
    }
  };
