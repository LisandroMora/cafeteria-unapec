"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Venta, VentaItem, Articulo, Usuario, Empleado } from "@/types";
import { VentasService } from "@/services/ventas.service";
import { ArticulosService } from "@/services/articulos.service";
import { UsuariosService } from "@/services/usuarios.service";
import { EmpleadosService } from "@/services/empleados.service";
import { ShoppingCart, Plus, Trash2, Search, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [showNewVenta, setShowNewVenta] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [currentItems, setCurrentItems] = useState<VentaItem[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVentas(VentasService.getAll());
    setArticulos(ArticulosService.getAll());
    setUsuarios(UsuariosService.getAll());
    setEmpleados(EmpleadosService.getAll());
  };

  const filteredVentas = ventas.filter(venta => {
    const usuario = usuarios.find(u => u.id === venta.usuarioId);
    const empleado = empleados.find(e => e.id === venta.empleadoId);
    return venta.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
           usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           empleado?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const calcularTotal = () => {
    return currentItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const agregarArticulo = () => {
    if (!selectedArticulo || cantidad <= 0) return;

    const articulo = articulos.find(a => a.id === selectedArticulo);
    if (!articulo) return;

    // Verificar existencia
    if (articulo.existencia < cantidad) {
      showMessage('error', `No hay suficiente existencia. Disponible: ${articulo.existencia}`);
      return;
    }

    const existingItemIndex = currentItems.findIndex(item => item.articuloId === selectedArticulo);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      const nuevaCantidad = updatedItems[existingItemIndex].cantidad + cantidad;
      
      // Verificar existencia con la nueva cantidad
      if (articulo.existencia < nuevaCantidad) {
        showMessage('error', `No hay suficiente existencia. Disponible: ${articulo.existencia}`);
        return;
      }
      
      updatedItems[existingItemIndex].cantidad = nuevaCantidad;
      updatedItems[existingItemIndex].subtotal = nuevaCantidad * articulo.precio;
      setCurrentItems(updatedItems);
    } else {
      const newItem: VentaItem = {
        articuloId: articulo.id,
        articulo: articulo,
        cantidad: cantidad,
        precio: articulo.precio,
        subtotal: cantidad * articulo.precio,
      };
      setCurrentItems([...currentItems, newItem]);
    }

    setSelectedArticulo("");
    setCantidad(1);
  };

  const eliminarArticulo = (articuloId: string) => {
    setCurrentItems(currentItems.filter(item => item.articuloId !== articuloId));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const guardarVenta = () => {
    if (!selectedEmpleado || !selectedUsuario || currentItems.length === 0) {
      showMessage('error', 'Por favor complete todos los campos y agregue al menos un artículo');
      return;
    }

    try {
      VentasService.create({
        empleadoId: selectedEmpleado,
        usuarioId: selectedUsuario,
        items: currentItems,
        total: calcularTotal(),
        estado: 'completada',
      });

      showMessage('success', 'Venta registrada exitosamente');
      loadData();
      limpiarFormulario();
    } catch (error) {
      showMessage('error', 'Error al registrar la venta');
    }
  };

  const limpiarFormulario = () => {
    setSelectedEmpleado("");
    setSelectedUsuario("");
    setCurrentItems([]);
    setSelectedArticulo("");
    setCantidad(1);
    setShowNewVenta(false);
  };

  const anularVenta = (ventaId: string) => {
    if (confirm("¿Está seguro de anular esta venta? Se restaurará el inventario.")) {
      const success = VentasService.anular(ventaId);
      if (success) {
        showMessage('success', 'Venta anulada exitosamente');
        loadData();
      } else {
        showMessage('error', 'Error al anular la venta');
      }
    }
  };

  if (showNewVenta) {
    return (
      <MainLayout>
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Nueva Venta</h2>
            <Button variant="outline" onClick={limpiarFormulario}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Empleado</Label>
                  <Select value={selectedEmpleado} onValueChange={setSelectedEmpleado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {empleados
                        .filter(e => e.estado)
                        .map(empleado => (
                          <SelectItem key={empleado.id} value={empleado.id}>
                            {empleado.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Usuario/Cliente</Label>
                  <Select value={selectedUsuario} onValueChange={setSelectedUsuario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios
                        .filter(u => u.estado)
                        .map(usuario => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nombre} - {usuario.cedula}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">RD$ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agregar Artículos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Artículo</Label>
                  <Select value={selectedArticulo} onValueChange={setSelectedArticulo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar artículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {articulos
                        .filter(a => a.estado && a.existencia > 0)
                        .map(articulo => (
                          <SelectItem key={articulo.id} value={articulo.id}>
                            {articulo.descripcion} - RD$ {articulo.precio} (Stock: {articulo.existencia})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>

                <Button 
                  onClick={agregarArticulo} 
                  className="w-full"
                  disabled={!selectedArticulo || cantidad <= 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Artículo
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Artículos en la Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artículo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay artículos agregados
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item) => (
                      <TableRow key={item.articuloId}>
                        <TableCell>{item.articulo?.descripcion}</TableCell>
                        <TableCell>RD$ {item.precio.toFixed(2)}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>RD$ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => eliminarArticulo(item.articuloId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={limpiarFormulario}>
              Cancelar
            </Button>
            <Button 
              onClick={guardarVenta}
              disabled={!selectedEmpleado || !selectedUsuario || currentItems.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Venta
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Ventas</h2>
          <Button onClick={() => setShowNewVenta(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de factura, cliente o empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No se encontraron ventas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVentas.map((venta) => {
                    const usuario = usuarios.find(u => u.id === venta.usuarioId);
                    const empleado = empleados.find(e => e.id === venta.empleadoId);
                    
                    return (
                      <TableRow key={venta.id}>
                        <TableCell className="font-medium">{venta.numeroFactura}</TableCell>
                        <TableCell>
                          {format(new Date(venta.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>{usuario?.nombre}</TableCell>
                        <TableCell>{empleado?.nombre}</TableCell>
                        <TableCell>RD$ {venta.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={venta.estado === 'completada' ? 'default' : 'destructive'}>
                            {venta.estado === 'completada' ? 'Completada' : 'Anulada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {venta.estado === 'completada' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => anularVenta(venta.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Anular
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}