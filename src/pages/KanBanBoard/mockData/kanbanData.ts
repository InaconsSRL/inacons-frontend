// src/mockData/kanbanData.ts

import { Board } from '../types/kanban';

export const mockBoard: Board = {
  columns: [
    {
      id: 'solicitud',
      title: 'Solicitud RQ',
      limit: 24,
      tasks: [
        {
          id: '1',
          title: 'CU-MON4 CAÑETE OPE RQ 126',
          description: 'Descripción de la tarea...',
          projectCode: 'CU-MON4',
          requestType: 'SERVICIO',
          purchaseType: 'LOGÍSTICA',
          deliveryDate: '05/11/2024',
          approvedBy: 'NEVIL RAYMUNDO',
          assignees: ['ESTHER MARILU VILLANO CA...'],
        },
        {
          id: '2',
          title: 'LI-MON2 LIMA MANTENIMIENTO RQ 237',
          description: 'Mantenimiento preventivo de equipos...',
          projectCode: 'LI-MON2',
          requestType: 'SERVICIO',
          purchaseType: 'MANTENIMIENTO',
          deliveryDate: '15/12/2024',
          approvedBy: 'CARLOS MENDOZA',
          assignees: ['JUAN PÉREZ', 'ANA GARCÍA'],
        },
        {
          id: '3',
          title: 'AR-MON1 AREQUIPA COMPRA RQ 089',
          description: 'Adquisición de repuestos para...',
          projectCode: 'AR-MON1',
          requestType: 'COMPRA',
          purchaseType: 'REPUESTOS',
          deliveryDate: '30/11/2024',
          approvedBy: 'MARÍA RODRÍGUEZ',
          assignees: ['LUIS SÁNCHEZ'],
        },
        {
          id: '4',
          title: 'TR-MON3 TRUJILLO OPE RQ 154',
          description: 'Operación de maquinaria pesada...',
          projectCode: 'TR-MON3',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '20/01/2025',
          approvedBy: 'JOSÉ TORRES',
          assignees: ['CARMEN VEGA', 'ROBERTO LUNA'],
        },
        {
          id: '5',
          title: 'PI-MON1 PIURA ALQUILER RQ 072',
          description: 'Alquiler de equipo de perforación...',
          projectCode: 'PI-MON1',
          requestType: 'ALQUILER',
          purchaseType: 'EQUIPOS',
          deliveryDate: '10/02/2025',
          approvedBy: 'LAURA FLORES',
          assignees: ['DIEGO MORALES'],
        },
        {
          id: '6',
          title: 'CU-MON2 CUSCO COMPRA RQ 201',
          description: 'Compra de insumos para laboratorio...',
          projectCode: 'CU-MON2',
          requestType: 'COMPRA',
          purchaseType: 'INSUMOS',
          deliveryDate: '25/11/2024',
          approvedBy: 'PEDRO VARGAS',
          assignees: ['SOFÍA RAMOS', 'JAVIER CRUZ'],
        },
        {
          id: '7',
          title: 'IC-MON4 ICA OPE RQ 118',
          description: 'Operación de planta de procesamiento...',
          projectCode: 'IC-MON4',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '05/03/2025',
          approvedBy: 'ANDREA CASTRO',
          assignees: ['MIGUEL ÁNGEL ORTIZ'],
        },
        {
          id: '8',
          title: 'TA-MON1 TACNA MANTENIMIENTO RQ 095',
          description: 'Mantenimiento correctivo de...',
          projectCode: 'TA-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'MANTENIMIENTO',
          deliveryDate: '18/12/2024',
          approvedBy: 'RAÚL JIMÉNEZ',
          assignees: ['PATRICIA WONG', 'FERNANDO QUISPE'],
        },
        {
          id: '9',
          title: 'CH-MON3 CHICLAYO COMPRA RQ 163',
          description: 'Adquisición de equipos de seguridad...',
          projectCode: 'CH-MON3',
          requestType: 'COMPRA',
          purchaseType: 'SEGURIDAD',
          deliveryDate: '22/01/2025',
          approvedBy: 'CECILIA PAREDES',
          assignees: ['HÉCTOR CHÁVEZ'],
        },
        {
          id: '10',
          title: 'HU-MON2 HUANCAYO ALQUILER RQ 137',
          description: 'Alquiler de vehículos para transporte...',
          projectCode: 'HU-MON2',
          requestType: 'ALQUILER',
          purchaseType: 'TRANSPORTE',
          deliveryDate: '08/02/2025',
          approvedBy: 'GABRIEL ROJAS',
          assignees: ['VALERIA MIRANDA', 'OSCAR HUAMÁN'],
        },
        {
          id: '11',
          title: 'AY-MON1 AYACUCHO OPE RQ 182',
          description: 'Operación de sistema de bombeo...',
          projectCode: 'AY-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '15/03/2025',
          approvedBy: 'ROSA MEDINA',
          assignees: ['EDUARDO PALOMINO'],
        }
      ],
    },
    {
      id: 'column3',
      title: 'En Progreso',
      limit: 6,
      tasks: [
        {
          id: '12',
          title: 'LI-MON2 LIMA COMPRA RQ 201',
          description: 'Adquisición de equipos de oficina...',
          projectCode: 'LI-MON2',
          requestType: 'COMPRA',
          purchaseType: 'EQUIPAMIENTO',
          deliveryDate: '10/04/2025',
          approvedBy: 'CARMEN FLORES',
          assignees: ['JAVIER LÓPEZ', 'MARÍA SÁNCHEZ'],
        },
        {
          id: '13',
          title: 'PI-MON1 PIURA MANTENIMIENTO RQ 215',
          description: 'Mantenimiento preventivo de maquinaria...',
          projectCode: 'PI-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'MANTENIMIENTO',
          deliveryDate: '25/04/2025',
          approvedBy: 'ROBERTO GARCÍA',
          assignees: ['ANA TORRES'],
        },
        {
          id: '14',
          title: 'CU-MON3 CUSCO ALQUILER RQ 228',
          description: 'Alquiler de equipos de construcción...',
          projectCode: 'CU-MON3',
          requestType: 'ALQUILER',
          purchaseType: 'CONSTRUCCIÓN',
          deliveryDate: '05/05/2025',
          approvedBy: 'LUIS MENDOZA',
          assignees: ['CARLOS VARGAS', 'DIANA PÉREZ'],
        },
        {
          id: '15',
          title: 'AR-MON1 AREQUIPA OPE RQ 240',
          description: 'Operación de planta de tratamiento...',
          projectCode: 'AR-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '20/05/2025',
          approvedBy: 'SILVIA RAMOS',
          assignees: ['PEDRO MAMANI'],
        },
      ],
    },
    {
      id: 'column4',
      title: 'En Revisión',
      limit: 6,
      tasks: [
        {
          id: '16',
          title: 'IC-MON2 ICA COMPRA RQ 253',
          description: 'Adquisición de materiales de construcción...',
          projectCode: 'IC-MON2',
          requestType: 'COMPRA',
          purchaseType: 'MATERIALES',
          deliveryDate: '02/06/2025',
          approvedBy: 'JORGE CASTRO',
          assignees: ['LAURA DÍAZ', 'RICARDO VELÁSQUEZ'],
        },
        {
          id: '17',
          title: 'TR-MON1 TRUJILLO MANTENIMIENTO RQ 267',
          description: 'Mantenimiento correctivo de sistemas eléctricos...',
          projectCode: 'TR-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'MANTENIMIENTO',
          deliveryDate: '15/06/2025',
          approvedBy: 'PATRICIA LUNA',
          assignees: ['MIGUEL RODRÍGUEZ'],
        },
        {
          id: '18',
          title: 'PU-MON3 PUNO ALQUILER RQ 280',
          description: 'Alquiler de equipos de medición...',
          projectCode: 'PU-MON3',
          requestType: 'ALQUILER',
          purchaseType: 'EQUIPOS',
          deliveryDate: '28/06/2025',
          approvedBy: 'ANDRÉS QUISPE',
          assignees: ['CARMEN HUAMÁN', 'FELIPE TORRES'],
        },
        {
          id: '19',
          title: 'CH-MON1 CHIMBOTE OPE RQ 294',
          description: 'Operación de sistema de monitoreo...',
          projectCode: 'CH-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '10/07/2025',
          approvedBy: 'MÓNICA VARGAS',
          assignees: ['RAÚL CHÁVEZ'],
        },
      ],
    },
    {
      id: 'column5',
      title: 'Completado',
      limit: 6,
      tasks: [
        {
          id: '20',
          title: 'HU-MON2 HUÁNUCO COMPRA RQ 308',
          description: 'Adquisición de equipos de seguridad...',
          projectCode: 'HU-MON2',
          requestType: 'COMPRA',
          purchaseType: 'SEGURIDAD',
          deliveryDate: '22/07/2025',
          approvedBy: 'CÉSAR MORALES',
          assignees: ['ELENA GARCÍA', 'OSCAR MENDOZA'],
        },
        {
          id: '21',
          title: 'TA-MON1 TACNA MANTENIMIENTO RQ 322',
          description: 'Mantenimiento preventivo de vehículos...',
          projectCode: 'TA-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'MANTENIMIENTO',
          deliveryDate: '05/08/2025',
          approvedBy: 'ROSA MEDINA',
          assignees: ['JUAN PÉREZ'],
        },
        {
          id: '22',
          title: 'AY-MON3 AYACUCHO ALQUILER RQ 336',
          description: 'Alquiler de espacios de almacenamiento...',
          projectCode: 'AY-MON3',
          requestType: 'ALQUILER',
          purchaseType: 'ALMACENAMIENTO',
          deliveryDate: '18/08/2025',
          approvedBy: 'FERNANDO LÓPEZ',
          assignees: ['LUCÍA TORRES', 'MARIO SÁNCHEZ'],
        },
        {
          id: '23',
          title: 'PI-MON1 PIURA OPE RQ 350',
          description: 'Operación de planta de energía...',
          projectCode: 'PI-MON1',
          requestType: 'SERVICIO',
          purchaseType: 'OPERACIONES',
          deliveryDate: '01/09/2025',
          approvedBy: 'CARLA RUIZ',
          assignees: ['DIEGO CASTRO'],
        },
        {
          id: '24',
          title: 'LI-MON2 LIMA COMPRA RQ 364',
          description: 'Adquisición de software especializado...',
          projectCode: 'LI-MON2',
          requestType: 'COMPRA',
          purchaseType: 'SOFTWARE',
          deliveryDate: '15/09/2025',
          approvedBy: 'ALBERTO WONG',
          assignees: ['SANDRA FLORES', 'VÍCTOR RAMÍREZ'],
        },
      ],
    },
  ],
};