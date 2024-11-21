import React from 'react';
import TableComponentSimple, { Column, CellType } from '../../../components/Table/TableComponentSimple';
import Modal from '../../../components/Modal/Modal';
import ComprasForm from './AddRecursoRequerimientoCompra';
import ProveedoresBoard from './ProveedoresBoard';

// Definir interfaces si es necesario
interface Requerimiento {
    id: string;
    usuario: string;
    fecha_solicitud: string;
    estado_atencion: string;
    sustento: string;
    codigo: string;
}

interface Recurso {
    id: string;
    requerimiento_id: string;
    codigo: string;
    nombre: string;
    unidad: string;
    precio_actual: number;
    cantidad: number;
    cantidad_total?: number;
}

interface RecursoSeleccionado {
    Recurso: Recurso;
    cantidadCompra: number;
}

interface RowData {
    id: string;
}

const products = [
    {
        id: '1',
        codigo: '15112024',
        nombre: 'AL_MICROCEMENTO PARA PARED NATURAL 5Kg',
        unidad: 'Bolsas',
        cantidad: '15112024',
        nota: 'Fijarse que este sellado',
    },
    {
        id: '2',
        codigo: '15112025',
        nombre: 'CEMENTO BLANCO 25Kg',
        unidad: 'Bolsas',
        cantidad: '10',
        nota: 'Verificar fecha de caducidad',
    },
    {
        
        id: '3',
        codigo: '15112026',
        nombre: 'ARENA FINA 50Kg',
        unidad: 'Sacos',
        cantidad: '20',
        nota: 'No debe contener humedad',
    },
    {
        id: '4',
        codigo: '15112027',
        nombre: 'GRAVA 20mm 50Kg',
        unidad: 'Sacos',
        cantidad: '15',
        nota: 'Debe estar limpia',
    },
    {
        id: '5',
        codigo: '15112028',
        nombre: 'LADRILLO ROJO 100u',
        unidad: 'Paquetes',
        cantidad: '5',
        nota: 'Sin grietas',
    },
    {
        id: '6',
        codigo: '15112029',
        nombre: 'VARILLA DE ACERO 12mm',
        unidad: 'Piezas',
        cantidad: '30',
        nota: 'Sin oxidación',
    },
    {
        id: '7',
        codigo: '15112030',
        nombre: 'MALLA ELECTROSOLDADA 2x2m',
        unidad: 'Piezas',
        cantidad: '10',
        nota: 'Revisar soldaduras',
    },
    {
        id: '8',
        codigo: '15112031',
        nombre: 'TUBO PVC 4" 6m',
        unidad: 'Piezas',
        cantidad: '25',
        nota: 'Sin fisuras',
    },
    {
        id: '9',
        codigo: '15112032',
        nombre: 'CABLE ELECTRICO 2.5mm 100m',
        unidad: 'Rollos',
        cantidad: '8',
        nota: 'Revisar aislamiento',
    },
    {
        id: '10',
        codigo: '15112033',
        nombre: 'PINTURA ACRILICA BLANCA 20L',
        unidad: 'Cubetas',
        cantidad: '12',
        nota: 'Agitar antes de usar',
    }
];

function ComprasSelectSources() {
    const [header] = React.useState({
        codigo: "-CU_PLAN",
        usuario: "Noe Cano",
        obra: "CU_PLAN",
        fechaFinal: "15-11-2024",
        sustento: "Sección Final de Empastado - Ala Bs"
    });
    
    const columns: Column[] = [
        { key: 'codigo', title: 'Código', type: 'text' as CellType },
        { key: 'nombre', title: 'Nombre', type: 'text' as CellType },
        { key: 'unidad', title: 'Unidad', type: 'text' as CellType },
        { key: 'cantidad', title: 'Cantidad', type: 'text' as CellType },
        { key: 'nota', title: 'Nota', type: 'text' as CellType },
    ];

    const actions = [
        {
            icon: '✏️',
            onClick: (row: RowData) => {
                // Lógica para editar el producto
                console.log('Editing product:', row);
            },
        },
        {
            icon: '🗑️',
            onClick: (row: RowData) => {
                // Lógica para eliminar el producto
                console.log('Deleting product:', row);
            },
        },
    ];

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isModalProveedorOpen, setIsModalProveedorOpen] = React.useState(false);

    const [requerimientos] = React.useState<Requerimiento[]>([
        {
            id: '1',
            usuario: 'Usuario 1',
            fecha_solicitud: '2023-10-15',
            estado_atencion: 'Pendiente',
            sustento: 'Sustento 1',
            codigo: 'REQ-001',
        },
        // ...otros requerimientos...
    ]);

    const [recursos] = React.useState<Recurso[]>([
        {
            id: '1',
            requerimiento_id: '1',
            codigo: 'REC-001',
            nombre: 'Recurso 1',
            unidad: 'kg',
            precio_actual: 10.0,
            cantidad: 5,
        },
        // ...otros recursos...
    ]);

    const handleSaveRecursos = (selectedRecursos: RecursoSeleccionado[]) => {
        // Manejar los recursos seleccionados
        console.log('Recursos seleccionados:', selectedRecursos);
        // ...agregar lógica para actualizar el estado de productos u otras acciones...
    };

    return (
        <div className="min-h-[80vh] bg-gray-100 p-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-x-4">
                    <div>
                        <p className="text-gray-600">Código:</p>
                        <p className="font-semibold">{header.codigo}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Usuario:</p>
                        <p className="font-semibold">{header.usuario}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Obra:</p>
                        <p className="font-semibold">{header.obra}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Fecha Final:</p>
                        <p className="font-semibold">{header.fechaFinal}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-600">Sustento:</p>
                        <p className="font-semibold">{header.sustento}</p>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setIsModalProveedorOpen(true)}
                    className="bg-blue-800 text-white px-4 py-2 rounded">
                    Proveedor
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Añadir Recursos
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Guardar
                </button>
                <button className="bg-yellow-400 text-white px-4 py-2 rounded">
                    Enviar
                </button>
            </div>

            {/* Reemplazar la tabla existente por TableComponentSimple */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <h2 className="text-xl font-semibold p-4 bg-blue-500 text-white">
                    Productos Seleccionados
                </h2>
                <TableComponentSimple
                    columns={columns}
                    data={products}
                    actions={actions}
                />
            </div>

            {/* Generate Order Button */}
            <div className="mt-6 flex justify-end">
                <button className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold">
                    Generar Orden Compra
                </button>
            </div>

            {/* Modal con ComprasForm */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Seleccionar Recursos"
            >
                <ComprasForm
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRecursos}
                    requerimientos={requerimientos}
                    recursos={recursos}
                />
            </Modal>
            <Modal
                isOpen={isModalProveedorOpen}
                onClose={() => setIsModalProveedorOpen(false)}
                title="Añadir Proveedores"
            >
                <ProveedoresBoard
                    onClose={() => setIsModalProveedorOpen(false)}
                    //onSave={handleSaveRecursos}
                    requerimientos={requerimientos}
                    recursos={recursos}
                />
            </Modal>
        </div>
    );
}

export default ComprasSelectSources;