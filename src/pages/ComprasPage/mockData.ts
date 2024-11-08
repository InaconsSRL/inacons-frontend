export const mockRequerimientos = [
    {
        id: "REQ-001",
        usuario: "Noe Cano",
        fecha_solicitud: "2024-11-04",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para obra principal",
        codigo: "0001-CU_GOLF-2024"
    },
    {
        id: "REQ-002",
        usuario: "Noe Cano",
        fecha_solicitud: "2024-11-05",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para acabados",
        codigo: "0002-CU_GOLF-2024"
    },
    {
        id: "REQ-003",
        usuario: "Juan Pérez",
        fecha_solicitud: "2024-11-06",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para instalaciones eléctricas",
        codigo: "0003-CU_GOLF-2024"
    },
    {
        id: "REQ-004",
        usuario: "María García",
        fecha_solicitud: "2024-11-07",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para instalaciones sanitarias",
        codigo: "0004-CU_GOLF-2024"
    },
    {
        id: "REQ-005",
        usuario: "Carlos López",
        fecha_solicitud: "2024-11-08",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para estructuras metálicas",
        codigo: "0005-CU_GOLF-2024"
    },
    {
        id: "REQ-006",
        usuario: "Ana Martínez",
        fecha_solicitud: "2024-11-09",
        estado_atencion: "aprobado_gerencia",
        sustento: "Requerimiento para carpintería",
        codigo: "0006-CU_GOLF-2024"
    }
];

export const mockRecursos = [
    {
        id: "REC-001",
        requerimiento_id: "REQ-001",
        codigo: "2880202",
        nombre: "Apisonadora Tipo Canguro",
        unidad: "UND",
        precio_actual: 1500.00,
        cantidad: 1
    },
    {
        id: "REC-002",
        requerimiento_id: "REQ-001",
        codigo: "2880203",
        nombre: "Cemento Portland Tipo I",
        unidad: "BOL",
        precio_actual: 25.50,
        cantidad: 100
    },
    {
        id: "REC-003",
        requerimiento_id: "REQ-001",
        codigo: "2880204",
        nombre: "Arena Gruesa",
        unidad: "M3",
        precio_actual: 45.00,
        cantidad: 30
    },
    {
        id: "REC-004",
        requerimiento_id: "REQ-002",
        codigo: "2880205",
        nombre: "Pintura Látex",
        unidad: "GAL",
        precio_actual: 35.00,
        cantidad: 20
    },
    {
        id: "REC-005",
        requerimiento_id: "REQ-002",
        codigo: "2880206",
        nombre: "Rodillo de Pintura",
        unidad: "UND",
        precio_actual: 15.00,
        cantidad: 5
    },
    {
        id: "REC-006",
        requerimiento_id: "REQ-002",
        codigo: "2880207",
        nombre: "Lija para Pared",
        unidad: "UND",
        precio_actual: 2.50,
        cantidad: 50
    },
    {
        id: "REC-007",
        requerimiento_id: "REQ-003",
        codigo: "2880208",
        nombre: "Cable Eléctrico 14 AWG",
        unidad: "M",
        precio_actual: 3.50,
        cantidad: 200
    },
    {
        id: "REC-008",
        requerimiento_id: "REQ-003",
        codigo: "2880209",
        nombre: "Tablero Eléctrico",
        unidad: "UND",
        precio_actual: 250.00,
        cantidad: 2
    },
    {
        id: "REC-009",
        requerimiento_id: "REQ-003",
        codigo: "2880210",
        nombre: "Interruptores Termomagnéticos",
        unidad: "UND",
        precio_actual: 45.00,
        cantidad: 10
    },
    {
        id: "REC-010",
        requerimiento_id: "REQ-004",
        codigo: "2880211",
        nombre: "Tubería PVC 4\"",
        unidad: "M",
        precio_actual: 15.00,
        cantidad: 100
    },
    {
        id: "REC-011",
        requerimiento_id: "REQ-004",
        codigo: "2880212",
        nombre: "Inodoro Completo",
        unidad: "UND",
        precio_actual: 280.00,
        cantidad: 8
    },
    {
        id: "REC-012",
        requerimiento_id: "REQ-004",
        codigo: "2880213",
        nombre: "Lavamanos",
        unidad: "UND",
        precio_actual: 150.00,
        cantidad: 8
    },
    {
        id: "REC-013",
        requerimiento_id: "REQ-005",
        codigo: "2880214",
        nombre: "Perfil de Acero",
        unidad: "M",
        precio_actual: 85.00,
        cantidad: 50
    },
    {
        id: "REC-014",
        requerimiento_id: "REQ-005",
        codigo: "2880215",
        nombre: "Soldadura",
        unidad: "KG",
        precio_actual: 25.00,
        cantidad: 20
    },
    {
        id: "REC-015",
        requerimiento_id: "REQ-005",
        codigo: "2880216",
        nombre: "Pernos de Anclaje",
        unidad: "UND",
        precio_actual: 5.00,
        cantidad: 100
    },
    {
        id: "REC-016",
        requerimiento_id: "REQ-006",
        codigo: "2880217",
        nombre: "Madera Tornillo",
        unidad: "P2",
        precio_actual: 8.50,
        cantidad: 200
    },
    {
        id: "REC-017",
        requerimiento_id: "REQ-006",
        codigo: "2880218",
        nombre: "Barniz",
        unidad: "GAL",
        precio_actual: 45.00,
        cantidad: 10
    },
    {
        id: "REC-018",
        requerimiento_id: "REQ-006",
        codigo: "2880219",
        nombre: "Bisagras",
        unidad: "PAR",
        precio_actual: 12.00,
        cantidad: 30
    }
];