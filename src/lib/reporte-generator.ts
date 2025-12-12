import { Venta, Usuario, Empleado, Articulo } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ventas, campus, proveedores, cafeterias, usuarios, empleados, articulos, marcas } from "@/lib/mock-data";

interface FiltrosReporte {
  tipoReporte: string;
  fechaDesde?: string;
  fechaHasta?: string;
  campusId?: string;
  cafeteriaId?: string;
  proveedorId?: string;
}

export function generarReporteHTML(ventasFiltradas: Venta[], filtros: FiltrosReporte): string {
  const fechaActual = new Date();
  const totalVentas = ventasFiltradas.reduce((sum, venta) => 
    venta.estado === 'completada' ? sum + venta.total : sum, 0
  );
  const totalAnuladas = ventasFiltradas.reduce((sum, venta) => 
    venta.estado === 'anulada' ? sum + venta.total : sum, 0
  );
  const cantidadTransacciones = ventasFiltradas.filter(v => v.estado === 'completada').length;
  const ticketPromedio = cantidadTransacciones > 0 ? totalVentas / cantidadTransacciones : 0;

  // Calcular productos más vendidos
  const productosVendidos = new Map<string, { cantidad: number; total: number; articulo?: Articulo }>();
  
  ventasFiltradas.forEach(venta => {
    if (venta.estado === 'completada') {
      venta.items.forEach(item => {
        const articulo = articulos.find(a => a.id === item.articuloId);
        if (articulo) {
          const existing = productosVendidos.get(item.articuloId) || { cantidad: 0, total: 0, articulo };
          existing.cantidad += item.cantidad;
          existing.total += item.subtotal;
          productosVendidos.set(item.articuloId, existing);
        }
      });
    }
  });

  const topProductos = Array.from(productosVendidos.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Obtener título según tipo de reporte
  let tituloReporte = 'REPORTE DE VENTAS';
  let subtitulo = '';
  
  switch (filtros.tipoReporte) {
    case 'por-campus':
      const campusObj = campus.find(c => c.id === filtros.campusId);
      tituloReporte = 'REPORTE DE VENTAS POR CAMPUS';
      subtitulo = campusObj ? campusObj.descripcion : 'Todos los campus';
      break;
    case 'por-cafeteria':
      const cafeteriaObj = cafeterias.find(c => c.id === filtros.cafeteriaId);
      tituloReporte = 'REPORTE DE VENTAS POR CAFETERÍA';
      subtitulo = cafeteriaObj ? cafeteriaObj.descripcion : 'Todas las cafeterías';
      break;
    case 'por-proveedor':
      const proveedorObj = proveedores.find(p => p.id === filtros.proveedorId);
      tituloReporte = 'REPORTE DE VENTAS POR PROVEEDOR';
      subtitulo = proveedorObj ? proveedorObj.nombreComercial : 'Todos los proveedores';
      break;
    default:
      tituloReporte = 'REPORTE GENERAL DE VENTAS';
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tituloReporte}</title>
    <style>
        ${getReportStyles()}
    </style>
</head>
<body>
    <div class="report-container">
        <!-- Report Header -->
        <div class="report-header">
            <div class="company-info">
                <div class="company-name">CAFETERÍA UNAPEC</div>
                <div>Sistema de Gestión de Cafeterías Universitarias</div>
                <div>RNC: 430-01234-5</div>
            </div>
        </div>

        <div class="report-title">${tituloReporte}</div>
        ${subtitulo ? `<div class="report-subtitle">${subtitulo}</div>` : ''}

        <div class="report-meta">
            <div class="meta-group">
                ${filtros.fechaDesde ? `
                <div class="meta-item">
                    <span class="meta-label">Desde:</span>
                    <span>${format(new Date(filtros.fechaDesde), 'dd/MM/yyyy')}</span>
                </div>
                ` : ''}
                ${filtros.fechaHasta ? `
                <div class="meta-item">
                    <span class="meta-label">Hasta:</span>
                    <span>${format(new Date(filtros.fechaHasta), 'dd/MM/yyyy')}</span>
                </div>
                ` : ''}
            </div>
            <div class="meta-group">
                <div class="meta-item">
                    <span class="meta-label">Fecha Generación:</span>
                    <span>${format(fechaActual, 'dd/MM/yyyy HH:mm')}</span>
                </div>
            </div>
        </div>

        <!-- Summary Section -->
        <div class="section-header">RESUMEN EJECUTIVO</div>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Total Ventas</div>
                <div class="summary-value">RD$ ${totalVentas.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Cantidad Transacciones</div>
                <div class="summary-value">${cantidadTransacciones}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Ticket Promedio</div>
                <div class="summary-value">RD$ ${ticketPromedio.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
        </div>

        <!-- Detail Section -->
        <div class="section-header">DETALLE DE VENTAS</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>No. Factura</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Empleado</th>
                    <th class="number">Monto</th>
                    <th class="center">Estado</th>
                </tr>
            </thead>
            <tbody>
                ${ventasFiltradas.map(venta => {
                    const usuario = usuarios.find(u => u.id === venta.usuarioId);
                    const empleado = empleados.find(e => e.id === venta.empleadoId);
                    return `
                    <tr>
                        <td>${venta.numeroFactura}</td>
                        <td>${format(venta.fecha, 'dd/MM/yyyy')}</td>
                        <td>${format(venta.fecha, 'HH:mm')}</td>
                        <td>${usuario?.nombre || 'N/A'}</td>
                        <td>${empleado?.nombre || 'N/A'}</td>
                        <td class="number">RD$ ${venta.total.toFixed(2)}</td>
                        <td class="center">
                            <span class="status status-${venta.estado}">
                                ${venta.estado === 'completada' ? 'Completada' : 'Anulada'}
                            </span>
                        </td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        <!-- Products Section -->
        ${topProductos.length > 0 ? `
        <div class="section-header">PRODUCTOS MÁS VENDIDOS</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th class="center">Cantidad</th>
                    <th class="number">Precio Unit.</th>
                    <th class="number">Total</th>
                </tr>
            </thead>
            <tbody>
                ${topProductos.map(item => `
                <tr>
                    <td>${item.articulo?.descripcion || 'N/A'}</td>
                    <td class="center">${item.cantidad}</td>
                    <td class="number">RD$ ${item.articulo?.precio.toFixed(2) || '0.00'}</td>
                    <td class="number">RD$ ${item.total.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <!-- Totals Section -->
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>RD$ ${(totalVentas + totalAnuladas).toFixed(2)}</span>
                </div>
                ${totalAnuladas > 0 ? `
                <div class="total-row">
                    <span>Ventas Anuladas:</span>
                    <span style="color: red;">-RD$ ${totalAnuladas.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="total-row">
                    <span>TOTAL GENERAL:</span>
                    <span>RD$ ${totalVentas.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="report-footer">
            <div>
                <div><strong>Generado por:</strong> Sistema de Cafetería v1.0</div>
                <div><strong>Usuario:</strong> admin@unapec.edu.do</div>
            </div>
            <div style="text-align: right;">
                <div>Este reporte es confidencial y de uso interno</div>
                <div>© 2024 Cafetería UNAPEC - Todos los derechos reservados</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

function getReportStyles(): string {
  return `
    @page {
        size: letter;
        margin: 0.5in;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.2;
        color: #000;
        background: white;
    }

    .report-container {
        max-width: 8.5in;
        margin: 0 auto;
        background: white;
        padding: 0.5in;
    }

    .report-header {
        border-bottom: 3px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    .company-info {
        text-align: center;
        margin-bottom: 10px;
    }

    .company-name {
        font-size: 18pt;
        font-weight: bold;
        color: #003366;
        margin-bottom: 5px;
    }

    .report-title {
        font-size: 14pt;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        background: #e0e0e0;
        padding: 5px;
        border: 1px solid #999;
    }

    .report-subtitle {
        font-size: 12pt;
        text-align: center;
        margin-bottom: 10px;
        font-style: italic;
    }

    .report-meta {
        display: flex;
        justify-content: space-between;
        font-size: 9pt;
        margin-bottom: 10px;
    }

    .meta-group {
        display: flex;
        gap: 20px;
    }

    .meta-item {
        display: flex;
        gap: 5px;
    }

    .meta-label {
        font-weight: bold;
    }

    .section-header {
        background: #003366;
        color: white;
        padding: 5px 10px;
        font-weight: bold;
        font-size: 11pt;
        margin: 20px 0 10px 0;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    .data-table th {
        background: #e0e0e0;
        border: 1px solid #999;
        padding: 5px;
        text-align: left;
        font-weight: bold;
        font-size: 9pt;
    }

    .data-table td {
        border: 1px solid #ccc;
        padding: 4px 5px;
        font-size: 9pt;
    }

    .data-table tr:nth-child(even) {
        background: #f9f9f9;
    }

    .number {
        text-align: right;
    }

    .center {
        text-align: center;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 20px;
    }

    .summary-item {
        text-align: center;
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
    }

    .summary-label {
        font-size: 9pt;
        color: #666;
        margin-bottom: 5px;
    }

    .summary-value {
        font-size: 14pt;
        font-weight: bold;
        color: #003366;
    }

    .totals-section {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    .totals-box {
        width: 300px;
        border: 2px solid #000;
        padding: 10px;
        background: #f9f9f9;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #ccc;
    }

    .total-row:last-child {
        border-bottom: none;
        font-weight: bold;
        font-size: 12pt;
        border-top: 2px solid #000;
        margin-top: 5px;
        padding-top: 10px;
    }

    .report-footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #000;
        font-size: 8pt;
        color: #666;
        display: flex;
        justify-content: space-between;
    }

    .status {
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 8pt;
        font-weight: bold;
    }

    .status-completada {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .status-anulada {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    @media print {
        body {
            background: white;
        }
    }
  `;
}