// Interfaces relacionadas con OrdenCompra
interface OrdenCompra {
  id: string;
  codigo_orden: string;
  estado: string;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
}

// Interfaces relacionadas con Usuario
interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  usuario: string;
  contrasenna: string;
  rol_id: string;
}

// Interfaz principal de OrdenPago
export interface OrdenPago {
  id: string;
  codigo: string;
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  orden_compra_id: OrdenCompra;
  estado: string;
  observaciones?: string;
  usuario_id: Usuario;
  comprobante?: string;
  fecha: string;
}

// Estado para el slice de Redux
export interface OrdenPagoState {
  ordenPagos: OrdenPago[];
  loading: boolean;
  error: string | null;
}

// Input para crear/actualizar
export interface OrdenPagoInput {
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  orden_compra_id: string;
  estado: string;
  observaciones?: string;
  usuario_id: string;
  comprobante?: string;
}

// Para actualización
export interface OrdenPagoUpdate extends OrdenPagoInput {
  id: string;
}

// Enums para valores constantes
export enum TipoMoneda {
  SOLES = 'SOLES',
  DOLARES = 'DOLARES',
  EUROS = 'EUROS'
}

export enum TipoPago {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  CHEQUE = 'CHEQUE'
}

export enum EstadoOrdenPago {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  ANULADO = 'ANULADO'
}


/*

 Este archivo incluye:

1. Interfaces anidadas (OrdenCompra, Usuario)
2. Interfaz principal OrdenPago
3. Interfaces para el estado de Redux
4. Interfaces para operaciones CRUD
5. Enums para valores constantes

Ahora puedes actualizar tus archivos existentes:

```typescript
// ordenPagoSlice.ts
import { 
  OrdenPago, 
  OrdenPagoState, 
  OrdenPagoInput 
} from '../types/ordenPago.type';

// ordenPagoService.ts
import { 
  OrdenPago, 
  OrdenPagoInput, 
  OrdenPagoUpdate 
} from '../types/ordenPago.type';

// OrdenPagoPage.tsx
import { 
  OrdenPago, 
  TipoMoneda, 
  TipoPago, 
  EstadoOrdenPago 
} from '../types/ordenPago.type';
```

Beneficios de usar este archivo de tipos:
1. Código más organizado y mantenible
2. Reutilización de tipos
3. Validación de tipos consistente
4. Autocompletado mejorado en el IDE
5. Documentación implícita de la estructura de datos

¿Necesitas ayuda para actualizar alguno de los archivos existentes con estos nuevos tipos?

*/
