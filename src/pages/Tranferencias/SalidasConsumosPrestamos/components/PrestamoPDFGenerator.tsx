import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';
import { PrestamoPDFGeneratorProps } from './prestamoPDF.types';
import logo from '../../../../assets/logoInacons.png';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
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
    fontSize: 14,
    marginBottom: 5,
    color: '#1a365d',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#2c5282',
    marginBottom: 3,
  },
  infoContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '25%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  value: {
    width: '75%',
    fontSize: 9,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c5282',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  colCodigo: { width: '15%', color: '#ffffff', fontSize: 9 },
  colDescripcion: { width: '45%', color: '#ffffff', fontSize: 9 },
  colCantidad: { width: '20%', color: '#ffffff', fontSize: 9 },
  colEstado: { width: '20%', color: '#ffffff', fontSize: 9 },
  cell: {
    fontSize: 9,
    color: '#000000',
  },
  termsContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  termTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  termText: {
    fontSize: 8,
    marginBottom: 3,
  },
  signatures: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '30%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: '100%',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
  },
  observaciones: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  observacionesText: {
    fontSize: 8,
    color: '#666666',
    marginLeft: 15,
    fontStyle: 'italic',
  },
});

const PrestamoPDFGenerator: React.FC<PrestamoPDFGeneratorProps> = ({ prestamo }) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  

  const documentFileName = `ACTA-PRESTAMO-${prestamo.codigo}.pdf`;
  
  // Nueva detección de dispositivos móviles y tablets
  const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(userAgent);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent);
    return isMobile || isTablet;
  };

  const PDFContent = (
    <Document title={documentFileName}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logo} />
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>ACTA DE PRÉSTAMO Y DEVOLUCIÓN</Text>
            <Text style={styles.subtitle}>{prestamo.codigo}</Text>
          </View>
        </View>

        {/* Información General */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Obra/Lugar:</Text>
            <Text style={styles.value}>{prestamo.obra.nombre} - {prestamo.obra.ubicacion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Almacenero:</Text>
            <Text style={styles.value}>{`${prestamo.almacenero.nombres} ${prestamo.almacenero.apellidos} - DNI: ${prestamo.almacenero.dni}`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Supervisor:</Text>
            <Text style={styles.value}>{`${prestamo.supervisor.nombres} ${prestamo.supervisor.apellidos}`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Empleado:</Text>
            <Text style={styles.value}>{`${prestamo.empleado.nombres} ${prestamo.empleado.apellidos} - DNI: ${prestamo.empleado.dni}`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha Emisión:</Text>
            <Text style={styles.value}>{formatDate(prestamo.fecha_emision.toISOString())}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha Retorno:</Text>
            <Text style={styles.value}>{prestamo.fecha_retorno.toISOString().split("T")[0].split("-").reverse().join("/")}</Text>
          </View>
        </View>

        {/* Tabla de Recursos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCodigo}>Código</Text>
            <Text style={styles.colDescripcion}>Descripción</Text>
            <Text style={styles.colCantidad}>Cantidad</Text>
            <Text style={styles.colEstado}>Estado</Text>
          </View>
          {prestamo.recursos.map((recurso, index) => (
            <React.Fragment key={index}>
              <View style={styles.tableRow}>
                <Text style={[styles.colCodigo, styles.cell]}>{recurso.recurso_id.codigo}</Text>
                <Text style={[styles.colDescripcion, styles.cell]}>{recurso.recurso_id.nombre}</Text>
                <Text style={[styles.colCantidad, styles.cell]}>{recurso.cantidad}</Text>
                <Text style={[styles.colEstado, styles.cell]}>{recurso.estado}</Text>
              </View>
              {recurso.observaciones.map((observacion, obsIndex) => (
                <View key={`${index}-${obsIndex}`} style={styles.tableRow}>
                  <Text style={styles.observacionesText}>
                    Observaciones: {observacion}
                  </Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>

        {/* Términos y Condiciones */}
        <View style={styles.termsContainer}>
          <Text style={styles.termTitle}>Términos y Condiciones del Préstamo:</Text>
          <Text style={styles.termText}>1. El trabajador se compromete a devolver los equipos/herramientas en el mismo estado en que fueron entregados.</Text>
          <Text style={styles.termText}>2. El trabajador asume la responsabilidad por cualquier daño o pérdida durante el período de préstamo.</Text>
          <Text style={styles.termText}>3. Los equipos deben ser devueltos en la fecha acordada.</Text>
          <Text style={styles.termText}>4. El incumplimiento de estos términos puede resultar en sanciones según las políticas de la empresa.</Text>
        </View>

        {/* Texto Legal */}
        <View style={styles.termsContainer}>
          <Text style={styles.termTitle}>Aceptación de Términos:</Text>
          <Text style={styles.termText}>
            Al generar este documento, las partes interesadas ({prestamo.almacenero.nombres}, {prestamo.supervisor.nombres} y {prestamo.empleado.nombres}) aceptan lo redactado en el presente documento.
          </Text>
        </View>
      </Page>
    </Document>
  );

  return isMobileOrTablet() ? PDFContent : (
    <PDFViewer style={{ width: '100%', height: '800px' }}>
      {PDFContent}
    </PDFViewer>
  );
};

export default PrestamoPDFGenerator;