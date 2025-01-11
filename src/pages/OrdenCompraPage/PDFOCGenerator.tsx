import { OrdenCompraExtendidaType, RecursoExtendidoType } from '../../types/ordenCompra.types';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';
import logo from '../../assets/logoInacons.png';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  headerLeft: {
    width: '30%',
  },
  headerRight: {
    width: '70%',
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    color: '#1a365d', // Azul oscuro profesional
    fontFamily: 'Helvetica-Bold',
  },
  obraText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#2c5282', // Azul medio
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8fafc',
  },
  infoLeft: {
    width: '50%',
  },
  infoRight: {
    width: '50%',
  },
  label: {
    fontFamily: 'Helvetica-Bold', // Corrección para el bold
    marginRight: 5,
    color: '#2d3748',
  },
  labelResponse: {
    fontSize: 9,
    width: '90%',
    color: '#4a5568',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
    backgroundColor: '#2c5282', // Azul profesional
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  colCodigo: { width: '8%', fontSize: 8, color: '#ffffff' },
  colDescripcion: { width: '30%', fontSize: 8, color: '#ffffff' },
  colNotas: { width: '24%', fontSize: 8, color: '#ffffff' },
  colUnid: { width: '6%', fontSize: 8, color: '#ffffff' },
  colCantidad: { width: '6%', textAlign: 'center', fontSize: 8, color: '#ffffff' },
  colPrecio: { width: '10%', textAlign: 'center', fontSize: 8, color: '#ffffff' },
  colDes: { width: '6%', textAlign: 'center', fontSize: 8, color: '#ffffff' },
  colSubTot: { width: '10%', textAlign: 'right', fontSize: 8, color: '#ffffff' },
  cellData: {
    color: '#2d3748',
    fontSize: 8,
  },
  totalesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalesBox: {
    width: '30%',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 3,
  },
  facturacionDespacho: {
    marginTop: 20,
    flexDirection: 'row',
  },
  facturacionBox: {
    width: '50%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  boxTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#1a365d',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e0',
    paddingBottom: 5,
  },
});

interface PDFOCGeneratorProps {
  ordenCompra: OrdenCompraExtendidaType;
  recursos: RecursoExtendidoType[];
}

const PDFOCGenerator: React.FC<PDFOCGeneratorProps> = ({ ordenCompra, recursos }) => {
  const documentFileName = `OC-${ordenCompra.codigo_orden}.pdf`;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const PDFContent = (
    <Document title={documentFileName}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logo} />
            <Text>INACONS S.R.L.</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>Orden de Compra</Text>
            <Text style={styles.obraText}>N° {ordenCompra.codigo_orden}    Obra {ordenCompra.obra}</Text>
          </View>
        </View>

        {/* Información del proveedor y detalles */}
        <View style={styles.infoContainer}>
          <View style={styles.infoLeft}>
            <View style={styles.row}>
              <Text style={styles.label}>Ruc:</Text>
              <Text>{ordenCompra.proveedor.ruc}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Razón Social:</Text>
              <Text>{ordenCompra.proveedor.razonSocial}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Forma de Pago:</Text>
              <Text>{ordenCompra.proveedor.formaPago}</Text>
            </View>
          </View>
          <View style={styles.infoRight}>
            <View style={styles.row}>
              <Text style={styles.label}>F.Emisión:</Text>
              <Text>{ordenCompra.fechaEmision}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Entrega:</Text>
              <Text>{ordenCompra.fechaEntrega}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Solicita:</Text>
              <Text>{ordenCompra.solicitante}</Text>
            </View>
          </View>
        </View>

        {/* Tabla de recursos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCodigo}>Código</Text>
            <Text style={styles.colDescripcion}>Descripción</Text>
            <Text style={styles.colNotas}>Notas</Text>
            <Text style={styles.colUnid}>Unid.</Text>
            <Text style={styles.colCantidad}>Cant.</Text>
            <Text style={styles.colPrecio}>Precio</Text>
            <Text style={styles.colDes}>%Des</Text>
            <Text style={styles.colSubTot}>Sub Tot</Text>
          </View>
          {recursos.map((recurso, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.colCodigo, styles.cellData]}>{recurso.id_recurso.codigo}</Text>
              <Text style={[styles.colDescripcion, styles.cellData]}>{recurso.id_recurso.nombre}</Text>
              <Text style={[styles.colNotas, styles.cellData]}>{recurso.notas}</Text>
              <Text style={[styles.colUnid, styles.cellData]}>UND</Text>
              <Text style={[styles.colCantidad, styles.cellData]}>{recurso.cantidad.toFixed(2)}</Text>
              <Text style={[styles.colPrecio, styles.cellData]}>S/ {recurso.precio.toFixed(2)}</Text>
              <Text style={[styles.colDes, styles.cellData]}>{recurso.descuento.toFixed(2)}</Text>
              <Text style={[styles.colSubTot, styles.cellData]}>S/ {recurso.subTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalesContainer}>
          <View style={styles.totalesBox}>
            <View style={styles.totalesRow}>
              <Text>Neto:</Text>
              <Text>S/ {recursos.reduce((sum, r) => sum + r.subTotal, 0).toFixed(2)}</Text>
            </View>
            <View style={styles.totalesRow}>
              <Text>IGV:</Text>
              <Text>S/ {(recursos.reduce((sum, r) => sum + r.subTotal, 0) * 0.18).toFixed(2)}</Text>
            </View>
            <View style={styles.totalesRow}>
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.label}>
                S/ {(recursos.reduce((sum, r) => sum + r.subTotal, 0) * 1.18).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Facturación y Despacho */}
        <View style={styles.facturacionDespacho}>
          <View style={styles.facturacionBox}>
            <Text style={styles.boxTitle}>Datos para Facturar</Text>
            <View style={styles.row}>
              <Text style={styles.label}>R.Social:</Text>
              <Text>{ordenCompra.datosFacturacion.rSocial}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>RUC:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.ruc}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Giro:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.giro}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.direccion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ciudad:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.ciudad}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fono:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.fono}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>EMail:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosFacturacion.email}</Text>
            </View>
          </View>
          <View style={[styles.facturacionBox, { marginLeft: 10 }]}>
            <Text style={styles.boxTitle}>Datos para Despachar</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Obra:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.obra}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Despacho:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.despacho}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.direccion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ciudad:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.ciudad}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Departamento:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.departamento}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fono:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.fono}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>EMail:</Text>
              <Text style={styles.labelResponse}>{ordenCompra.datosDespacho.email}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return isMobile ? (
    PDFContent
  ) : (
    <PDFViewer style={{ width: '100%', height: '800px' }}>
      {PDFContent}
    </PDFViewer>
  );
};

export default PDFOCGenerator;