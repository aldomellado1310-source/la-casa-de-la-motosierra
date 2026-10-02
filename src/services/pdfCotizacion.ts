// ============================================================
// Generación del PDF de cotización formal (jsPDF).
// Se genera en el cliente para descarga inmediata; la Cloud
// Function `generarPdfCotizacion` produce el mismo documento
// en el servidor y lo guarda en Storage (pdfUrl).
// ============================================================
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatoCLP } from '../utils/precio';
import type { Cotizacion } from '../types';

// Colores de la identidad 2.0 (ver DESIGN.md)
const CARBON: [number, number, number] = [14, 15, 14];
const NARANJA: [number, number, number] = [238, 129, 0];
const GRAFITO: [number, number, number] = [28, 29, 28];

const DATOS_TIENDA = {
  nombre: 'La Casa de la Motosierra',
  giro: 'Repuestos y maquinaria forestal/agrícola',
  direccion: 'Teniente Merino 500, Puerto Aysén, Región de Aysén',
  telefono: '+56 9 8756 8465',
  email: 'lacasadelamotosierraaysenspa@gmail.com',
  rut: '78.269.561-4',
};

/** Genera y descarga el PDF de una cotización */
export function descargarPdfCotizacion(cot: Cotizacion): void {
  const docPdf = new jsPDF({ unit: 'mm', format: 'letter' });
  const anchoPagina = docPdf.internal.pageSize.getWidth();
  const margen = 18;

  // --- Encabezado con identidad de la tienda ---
  docPdf.setFillColor(...CARBON);
  docPdf.rect(0, 0, anchoPagina, 30, 'F');

  // Logo simple: motosierra estilizada en texto
  docPdf.setTextColor(247, 245, 240);
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(16);
  docPdf.text(DATOS_TIENDA.nombre.toUpperCase(), margen, 13);
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(8.5);
  docPdf.text(DATOS_TIENDA.giro, margen, 19);
  docPdf.text(`${DATOS_TIENDA.direccion} · ${DATOS_TIENDA.telefono}`, margen, 24);

  // Folio destacado a la derecha
  docPdf.setFillColor(...NARANJA);
  docPdf.rect(anchoPagina - margen - 52, 8, 52, 15, 'F');
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(11);
  docPdf.text('COTIZACIÓN', anchoPagina - margen - 26, 14, { align: 'center' });
  docPdf.setFontSize(10);
  docPdf.text(cot.folio, anchoPagina - margen - 26, 20, { align: 'center' });

  // --- Datos del cliente y fechas ---
  docPdf.setTextColor(...GRAFITO);
  docPdf.setFontSize(9.5);
  let y = 40;
  const fecha = new Date(cot.fecha).toLocaleDateString('es-CL');
  const vence = new Date(cot.validaHasta).toLocaleDateString('es-CL');

  docPdf.setFont('helvetica', 'bold');
  docPdf.text('CLIENTE', margen, y);
  docPdf.text('DETALLE', anchoPagina / 2 + 10, y);
  docPdf.setFont('helvetica', 'normal');
  y += 6;
  docPdf.text(cot.razonSocial ?? cot.nombreCliente, margen, y);
  docPdf.text(`Fecha emisión: ${fecha}`, anchoPagina / 2 + 10, y);
  y += 5;
  if (cot.rut) {
    docPdf.text(`RUT: ${cot.rut}`, margen, y);
  }
  docPdf.text(`Válida hasta: ${vence}`, anchoPagina / 2 + 10, y);
  y += 5;
  docPdf.text(cot.emailCliente, margen, y);
  docPdf.text(`Emisor RUT: ${DATOS_TIENDA.rut}`, anchoPagina / 2 + 10, y);
  y += 8;

  // --- Tabla de ítems ---
  autoTable(docPdf, {
    startY: y,
    margin: { left: margen, right: margen },
    head: [['SKU', 'Producto', 'Cant.', 'P. Unitario', 'Subtotal']],
    body: cot.items.map((it) => [
      it.sku,
      it.nombre,
      String(it.cantidad),
      formatoCLP(it.precioUnitario),
      formatoCLP(it.precioUnitario * it.cantidad),
    ]),
    styles: { fontSize: 8.5, textColor: GRAFITO },
    headStyles: { fillColor: CARBON, textColor: [247, 245, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 245, 240] },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
  });

  // --- Totales ---
  const yTabla = (docPdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  let yTot = yTabla + 8;
  const xEtiqueta = anchoPagina - margen - 60;
  const xValor = anchoPagina - margen;

  docPdf.setFontSize(9.5);
  docPdf.text('Neto:', xEtiqueta, yTot);
  docPdf.text(formatoCLP(cot.neto), xValor, yTot, { align: 'right' });
  yTot += 6;
  docPdf.text('IVA (19%):', xEtiqueta, yTot);
  docPdf.text(formatoCLP(cot.iva), xValor, yTot, { align: 'right' });
  yTot += 7;
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(11);
  docPdf.setTextColor(...NARANJA);
  docPdf.text('TOTAL:', xEtiqueta, yTot);
  docPdf.text(formatoCLP(cot.total), xValor, yTot, { align: 'right' });

  // --- Observaciones y pie ---
  docPdf.setTextColor(...GRAFITO);
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(8.5);
  let yPie = yTot + 12;
  if (cot.observaciones) {
    docPdf.setFont('helvetica', 'bold');
    docPdf.text('Observaciones:', margen, yPie);
    docPdf.setFont('helvetica', 'normal');
    yPie += 5;
    const lineas = docPdf.splitTextToSize(cot.observaciones, anchoPagina - margen * 2);
    docPdf.text(lineas, margen, yPie);
    yPie += lineas.length * 4 + 4;
  }
  docPdf.setTextColor(120, 120, 120);
  docPdf.text(
    [
      `Cotización válida por 15 días desde su emisión. Precios en CLP, IVA incluido en el total.`,
      `Documento de respaldo para órdenes de compra de empresas, faenas forestales y municipios.`,
      `${DATOS_TIENDA.email} · ${DATOS_TIENDA.telefono}`,
    ],
    margen,
    yPie + 4,
  );

  docPdf.save(`${cot.folio}.pdf`);
}
