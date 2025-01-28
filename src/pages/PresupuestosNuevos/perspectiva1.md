# Interfaces del Sistema de Presupuestos

## Tabla de Contenidos
- [Unidades](#unidades)
- [Recursos](#recursos)
- [Tipos de Recurso](#tipos-de-recurso)
- [Títulos de Partidas](#títulos-de-partidas)

## Unidades
Interface que define los parámetros básicos de las unidades de medida utilizadas en el sistema.
Las unidades son fundamentales para la medición y cálculo de recursos y partidas.

```typescript
interface IUnidad {
    unidad_id: number;
    descripcion: string;
    simbolo: string;
}
```

## Recursos
Interface que define la estructura base de los recursos utilizados en el presupuesto.
Cada recurso está asociado a una unidad de medida y a un tipo específico.

```typescript
interface IRecurso {
    recurso_id: number;
    nombre: string;
    unidad_id: number;
    Id_Tipo: number;
    Id_RecursosLosgistica: number;
}
```

## Tipos de Recurso
Interface que establece las categorías principales de recursos disponibles en el sistema.
Permite clasificar los recursos en grupos lógicos para su mejor gestión.

```typescript
interface ITipoRecurso {
    tipo_recurso_id: number;
    nombre: string;
    abreviatura: string;
}
```

## Títulos de Partidas
Interface que define la estructura de los títulos de partidas:

```typescript
interface ITituloPartida {
    titulo_partida_id: number;
    descripcion: string;
    unidad_id: number;
    id_especialidad: number;
}
```

## Análisis de Precios Unitarios
Interface que define la estructura para el análisis detallado de los costos unitarios.
Incluye rendimientos, jornadas y cantidades necesarias para el cálculo de costos.

```typescript
interface IAnalisisPreciosUnitarios {
    partida_id: number;
    recurso_id: number;
    rendMO: number;
    rendEQ: number;
    jornada: number;
    cuadrilla: number;
    cantidad: number;
    precio: number;
}
```

## Proyectos
Interface que establece los datos principales de cada proyecto constructivo.
Contiene información esencial como cliente, ubicación, plazos y montos presupuestados.

```typescript
interface IProyecto {
    proyecto_id: number;
    descripcion: string;
    cliente_id: number;
    ubicacion_id: number;
    empresa_id: number;
    moneda_id: number;
    fecha: Date;
    plazo: number;
    ppto_base: number;
    ppto_oferta: number;
    jornada: number;
}
```

## Presupuestos
Interface que define la estructura de los presupuestos asociados a un proyecto.
Incluye información temporal y económica específica del presupuesto.

```typescript
interface IPresupuesto {
    presupuesto_id: number;
    descripcion: string;
    fecha: Date;
    plazo: number;
    ppto_base: number;
    ppto_oferta: number;
    proyecto_id: number;
}
```

## Especialidades
Interface que define las diferentes áreas técnicas o especialidades del proyecto.
Permite categorizar los trabajos según su naturaleza técnica.

```typescript
interface IEspecialidad {
    id_especialidad: number;
    descripcion: string;
}
```

## Títulos
Interface que establece la estructura de los títulos organizativos del presupuesto.
Facilita la agrupación jerárquica de partidas por especialidad.

```typescript
interface ITitulo {
    titulos_id: number;
    descripcion: string;
    id_especialidad: number;
}
```

## Partidas de Presupuesto
Interface que vincula las partidas específicas con un presupuesto determinado.
Permite la organización y gestión de partidas dentro del presupuesto.

```typescript
interface IPartidaPpto {
    partida_ppto_id: number;
    presupuesto_id: number;
    partida_id: number;
}
```

## Organización
Interface que define la estructura jerárquica y organizativa del presupuesto.
Establece niveles, órdenes y relaciones entre los diferentes elementos presupuestarios.

```typescript
interface IOrganizacion {
    item_id: number;
    presupuesto_id: number;
    titulos_id: number;
    partida_ppto_id: number;
    orden: number;
    nivel: number;
    item: string;
}
```

## Hoja de Presupuesto
Interface que define la estructura de cada línea del presupuesto detallado.
Incluye metrados, precios y cálculos acumulados para cada ítem.

```typescript
interface IHojaPpto {
    hoja_ppto_id: number;
    presupuesto_id: number;
    item_id: number;
    metrado: number;
    precio: number;
    parcial: number;
    costo_acumulado: number;
}
```

## APU Presupuesto
Interface que establece la estructura del análisis de precios unitarios específico del presupuesto.
Contiene los detalles de rendimientos, cantidades y precios para cada recurso en una partida.

```typescript
interface IApuPpto {
    apu_ppto_id: number;
    partida_id: number;
    recurso_id: number;
    rendMO: number;
    rendEQ: number;
    jornada: number;
    cuadrilla: number;
    cantidad: number;
    precio: number;
}
```