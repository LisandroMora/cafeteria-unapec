"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Filter, Printer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ventas, campus, proveedores, cafeterias, usuarios, empleados, articulos, marcas } from "@/lib/mock-data";
import { generarReporteHTML } from "@/lib/reporte-generator";

type TipoReporte = 'general' | 'por-campus' | 'por-cafeteria' | 'por-proveedor' | 'por-producto';

export default function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('general');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [campusId, setCampusId] = useState('all');
  const [cafeteriaId, setCafeteriaId] = useState('all');
  const [proveedorId, setProveedorId] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [reporteHTML, setReporteHTML] = useState('');

  const generarReporte = () => {
    // Filtrar ventas según criterios
    let ventasFiltradas = [...ventas];
    
    // Filtrar por fechas
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      ventasFiltradas = ventasFiltradas.filter(v => v.fecha >= desde);
    }
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59);
      ventasFiltradas = ventasFiltradas.filter(v => v.fecha <= hasta);
    }

    // Filtrar según tipo de reporte
    switch (tipoReporte) {
      case 'por-campus':
        if (campusId) {
          // Filtrar por campus a través de cafeterías
          const cafeteriasCampus = cafeterias.filter(c => c.campusId === campusId);
          // En un sistema real, las ventas estarían relacionadas con cafeterías
          // Por ahora simulamos con un filtro aleatorio
          ventasFiltradas = ventasFiltradas.slice(0, Math.floor(ventasFiltradas.length * 0.7));
        }
        break;
      case 'por-cafeteria':
        if (cafeteriaId) {
          // Simular filtro por cafetería
          ventasFiltradas = ventasFiltradas.slice(0, Math.floor(ventasFiltradas.length * 0.5));
        }
        break;
      case 'por-proveedor':
        if (proveedorId) {
          // Filtrar ventas que contengan productos del proveedor
          ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.items.some(item => {
              const articulo = articulos.find(a => a.id === item.articuloId);
              return articulo?.proveedorId === proveedorId;
            })
          );
        }
        break;
    }

    // Generar HTML del reporte
    const html = generarReporteHTML(
      ventasFiltradas,
      {
        tipoReporte,
        fechaDesde,
        fechaHasta,
        campusId,
        cafeteriaId,
        proveedorId,
      }
    );

    setReporteHTML(html);
    setShowPreview(true);
  };

  const imprimirReporte = () => {
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(reporteHTML);
      ventana.document.close();
      ventana.print();
    }
  };

  const descargarReporte = () => {
    const blob = new Blob([reporteHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Generación de Reportes</h2>
        </div>

        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Reporte</CardTitle>
                <CardDescription>
                  Seleccione los parámetros para generar el reporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Reporte</Label>
                  <Select value={tipoReporte} onValueChange={(value) => setTipoReporte(value as TipoReporte)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Reporte General de Ventas</SelectItem>
                      <SelectItem value="por-campus">Ventas por Campus</SelectItem>
                      <SelectItem value="por-cafeteria">Ventas por Cafetería</SelectItem>
                      <SelectItem value="por-proveedor">Ventas por Proveedor</SelectItem>
                      <SelectItem value="por-producto">Ventas por Producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Desde</Label>
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Hasta</Label>
                    <Input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </div>
                </div>

                {tipoReporte === 'por-campus' && (
                    <div className="space-y-2">
                        <Label>Campus</Label>
                        <Select value={campusId} onValueChange={setCampusId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todos los campus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {campus.filter(c => c.estado).map(c => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.descripcion}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                )}

                {tipoReporte === 'por-cafeteria' && (
                    <div className="space-y-2">
                        <Label>Cafetería</Label>
                        <Select value={cafeteriaId} onValueChange={setCafeteriaId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todas las cafeterías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {cafeterias.filter(c => c.estado).map(c => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.descripcion}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                )}

                {tipoReporte === 'por-proveedor' && (
                    <div className="space-y-2">
                        <Label>Proveedor</Label>
                        <Select value={proveedorId} onValueChange={setProveedorId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Todos los proveedores" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {proveedores.filter(p => p.estado).map(p => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.nombreComercial}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                )}

                <Button onClick={generarReporte} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>
                  Configure los parámetros y genere el reporte para ver la vista previa
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No hay reporte generado</p>
                  <p className="text-sm mt-2">Configure los parámetros y presione Generar Reporte</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <Filter className="mr-2 h-4 w-4" />
                Cambiar Filtros
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={imprimirReporte}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button onClick={descargarReporte}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <iframe
                  srcDoc={reporteHTML}
                  className="w-full h-[600px] border-0"
                  title="Vista previa del reporte"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}