import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import logo from '../../../assets/logoInacons.png';
import { TransferenciaRecurso } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  logo: {
    width: 80,
    height: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 5,
  },
  codigo: { width: '15%' },
  nombre: { width: '35%' },
  unidad: { width: '10%' },
  cantidad: { width: '15%', textAlign: 'right' },
  precio: { width: '12%', textAlign: 'right' },
  total: { width: '13%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  totalLabel: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    width: '13%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  comentario: {
    fontSize: 9,
    marginBottom: 30,
  },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  firma: {
    width: '45%',
  },
  lineaFirma: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginBottom: 5,
  },
  nombreFirma: {
    fontSize: 10,
    textAlign: 'center',
  },
  cargoFirma: {
    fontSize: 9,
    textAlign: 'center',
    color: '#666',
  }
});

interface RecursoRecibido {
  id: string;
  cantidad_recibida: number;
  cantidad_original: number;
  diferencia: number;
}

interface Props {
  numero: number;
  solicita: string;
  recibe: string;
  fEmision: Date;
  estado: string;
  obra: string;
  recursos: RecursoRecibido[];
  transferenciaRecursos: TransferenciaRecurso[];
  unidades: Array<{
    id: string;
    nombre: string;
  }>;
  tipoTransporte: string;
  usuarioTransferencia: {
    nombres: string;
    apellidos: string;
  };
  descripcionMovimiento: string;
  observaciones?: string;
  obraDestino: string;
}

const GuiaTransferPDF: React.FC<Props> = ({
  numero,
  solicita,
  recibe,
  fEmision,
  estado,
  obra,
  recursos,
  transferenciaRecursos,
  unidades,
  tipoTransporte,
  usuarioTransferencia,
  descripcionMovimiento,
  observaciones,
  obraDestino
}) => {

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };


  const getUnidadNombre = (unidadId: string) => {
    return unidades?.find(u => u.id === unidadId)?.nombre || 'UND';
  };

  const calcularTotal = (cantidad: number = 0, precio: number = 0) => {
    try {
      return (cantidad * precio).toFixed(2);
    } catch (e) {
      return '0.00';
    }
  };

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.companyName}>INACONS S.R.L.</Text>
            <Image src={logo} style={styles.logo} />
          </View>

          <Text style={styles.title}>TRASFERENCIA A OTRAS OBRAS</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Numero</Text>
              <Text style={styles.value}>{numero}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>F.Emision</Text>
              <Text style={styles.value}>{formatDate(fEmision)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Digita</Text>
              <Text style={styles.value}>OPERACIONES</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Obra</Text>
              <Text style={styles.value}>{obra}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Recibe</Text>
              <Text style={styles.value}>{recibe}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Estado</Text>
              <Text style={styles.value}>{estado}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Notas</Text>
              <Text style={styles.value}>TR GR EG07-2925 - MOLDES DE BUZON - ZARANDA - CACHACO</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Aprobac.</Text>
              <Text style={styles.value}>Aprobado</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Obra Destino</Text>
              <Text style={styles.value}>{obraDestino}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.codigo}>Código</Text>
              <Text style={styles.nombre}>Nombre</Text>
              <Text style={styles.unidad}>Unidad</Text>
              <Text style={styles.cantidad}>Cantidad</Text>
              <Text style={styles.precio}>Precio</Text>
              <Text style={styles.total}>Total</Text>
            </View>

            {transferenciaRecursos.map((recurso, index) => {
              const cantidad = recurso.cantidad || 0;
              const precio = recurso.recurso_id?.precio_actual || 0;
              const total = calcularTotal(cantidad, precio);
              const unidad = getUnidadNombre(recurso.recurso_id?.unidad_id);

              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.codigo}>{recurso.recurso_id?.codigo || ''}</Text>
                  <Text style={styles.nombre}>{recurso.recurso_id?.nombre || ''}</Text>
                  <Text style={styles.unidad}>{unidad}</Text>
                  <Text style={styles.cantidad}>{cantidad.toFixed(2)}</Text>
                  <Text style={styles.precio}>{precio.toFixed(2)}</Text>
                  <Text style={styles.total}>{total}</Text>
                </View>
              );
            })}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {transferenciaRecursos.reduce((sum, recurso) => {
                  const cantidad = recurso.cantidad || 0;
                  const precio = recurso.recurso_id?.precio_actual || 0;
                  return sum + (cantidad * precio);
                }, 0).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.comentario}>ENVIADO DE ALMACEN CU-PLAN3</Text>
            
            <View style={styles.firmas}>
              <View style={styles.firma}>
                <View style={styles.lineaFirma} />
                <Text style={styles.nombreFirma}>ERIK CENTENO</Text>
              </View>
              <View style={styles.firma}>
                <View style={styles.lineaFirma} />
                <Text style={styles.nombreFirma}></Text>
                <Text style={styles.cargoFirma}>Recibe</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default GuiaTransferPDF;