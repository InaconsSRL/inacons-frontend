import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import { Image } from '@react-pdf/renderer';
import logo from '../../assets/logoInacons.png';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#1a4b8c',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 150,
    height: 60,
    marginBottom: 10,
    backgroundColor: '#f5f5f5', // Placeholder para el logo
  },
  headerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 20,
    color: '#1a4b8c',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#2c5282',
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginTop: 20,
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#2c5282',
    fontWeight: 'bold',
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    flex: 0.75,
  },
  tableCellNombre: {
    padding: 8,
    flex: 3, // Aumenta el ancho de la columna "Nombre"
  },
  rightAlign: {
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: '#1a4b8c',
    paddingTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#2c5282',
    fontWeight: 'bold',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 14,
    color: '#1a4b8c',
    fontWeight: 'bold',
  },
});

interface PDFGeneratorProps {
  ordenCompra: {
    id: string;
    codigo_orden: string;
    descripcion: string;
    fecha_ini: string;
    fecha_fin: string;
  };
  recursos: Array<{
    id: string;
    id_recurso: {
      codigo: string;
      nombre: string;
      unidad_id: string;
    };
    cantidad: number;
    costo_real: number;
    costo_aproximado: number;
    estado: string;
  }>;
  unidades: Array<{
    id: string;
    nombre: string;
  }>;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  ordenCompra,
  recursos,
  unidades,
}) => {

  console.log(ordenCompra)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => `S/ ${value.toFixed(2)}`;

  const totalReal = recursos.reduce(
    (sum, item) => sum + item.costo_real * item.cantidad,
    0
  );
  const totalAproximado = recursos.reduce(
    (sum, item) => sum + item.costo_aproximado * item.cantidad,
    0
  );

  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                src={logo}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Orden de Compra: {ordenCompra.codigo_orden}</Text>
              <Text style={styles.subtitle}>
                Fecha Inicio: {formatDate(ordenCompra.fecha_ini)}
              </Text>
              <Text style={styles.subtitle}>
                Fecha Fin: {formatDate(ordenCompra.fecha_fin)}
              </Text>
              <Text style={styles.subtitle}>{ordenCompra.descripcion}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Código</Text>
              <Text style={[styles.tableCellNombre, styles.tableHeaderText]}>Nombre</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Unidad</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, styles.rightAlign]}>Cantidad</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, styles.rightAlign]}>Costo Real</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, styles.rightAlign]}>Costo Aprox.</Text>
            </View>

            {recursos.map((recurso) => (
              <View key={recurso.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{recurso.id_recurso.codigo}</Text>
                <Text style={styles.tableCellNombre}>{recurso.id_recurso.nombre}</Text>
                <Text style={styles.tableCell}>
                  {unidades.find((u) => u.id === recurso.id_recurso.unidad_id)?.nombre || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, styles.rightAlign]}>
                  {recurso.cantidad}
                </Text>
                <Text style={[styles.tableCell, styles.rightAlign]}>
                  {formatCurrency(recurso.costo_real)}
                </Text>
                <Text style={[styles.tableCell, styles.rightAlign]}>
                  {formatCurrency(recurso.costo_aproximado)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Real:</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalReal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Aproximado:</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalAproximado)}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFGenerator;