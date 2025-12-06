"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/shared/data-table";
import { CrudDialog } from "@/components/shared/crud-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Articulo } from "@/types";
import { articulos as initialData, marcas, proveedores } from "@/lib/mock-data";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  marcaId: z.string().min(1, "Debe seleccionar una marca"),
  costo: z.number().min(0.01, "El costo debe ser mayor a 0"),
  precio: z.number().min(0.01, "El precio debe ser mayor a 0"),
  proveedorId: z.string().min(1, "Debe seleccionar un proveedor"),
  existencia: z.number().min(0, "La existencia no puede ser negativa"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function ArticulosPage() {
  const [data, setData] = useState<Articulo[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Articulo | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Articulo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: true,
      existencia: 0,
    },
  });

  const columns = [
    { key: "id" as keyof Articulo, label: "ID" },
    { key: "descripcion" as keyof Articulo, label: "Descripción" },
    {
      key: "marcaId" as keyof Articulo,
      label: "Marca",
      render: (value: string) => {
        const marca = marcas.find(m => m.id === value);
        return marca?.descripcion || value;
      }
    },
    { 
      key: "costo" as keyof Articulo, 
      label: "Costo",
      render: (value: number) => `RD$ ${value.toFixed(2)}`
    },
    { 
      key: "precio" as keyof Articulo, 
      label: "Precio",
      render: (value: number) => `RD$ ${value.toFixed(2)}`
    },
    {
      key: "proveedorId" as keyof Articulo,
      label: "Proveedor",
      render: (value: string) => {
        const proveedor = proveedores.find(p => p.id === value);
        return proveedor?.nombreComercial || value;
      }
    },
    { key: "existencia" as keyof Articulo, label: "Existencia" },
    { key: "estado" as keyof Articulo, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ 
      descripcion: "", 
      marcaId: "", 
      costo: 0, 
      precio: 0,
      proveedorId: "",
      existencia: 0,
      estado: true 
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Articulo) => {
    setEditingItem(item);
    setValue("descripcion", item.descripcion);
    setValue("marcaId", item.marcaId);
    setValue("costo", item.costo);
    setValue("precio", item.precio);
    setValue("proveedorId", item.proveedorId);
    setValue("existencia", item.existencia);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Articulo) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((d) => d.id !== itemToDelete.id));
      showMessage('success', 'El artículo ha sido eliminado correctamente.');
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const onSubmit = (formData: FormData) => {
    if (editingItem) {
      setData(
        data.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      showMessage('success', 'El artículo ha sido actualizado correctamente.');
    } else {
      const newItem: Articulo = {
        id: Date.now().toString(),
        ...formData,
      };
      setData([...data, newItem]);
      showMessage('success', 'El artículo ha sido creado correctamente.');
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    reset();
  };

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
      
      <DataTable
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKey="descripcion"
        searchPlaceholder="Buscar artículo..."
        title="Artículos"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Artículo" : "Nuevo Artículo"}
        description="Complete la información del artículo"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              {...register("descripcion")}
              placeholder="Descripción del artículo"
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Controller
              name="marcaId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas
                      .filter(m => m.estado)
                      .map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.descripcion}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.marcaId && (
              <p className="text-sm text-red-500">{errors.marcaId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costo">Costo</Label>
              <Input
                id="costo"
                type="number"
                {...register("costo", { valueAsNumber: true })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.costo && (
                <p className="text-sm text-red-500">{errors.costo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                {...register("precio", { valueAsNumber: true })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.precio && (
                <p className="text-sm text-red-500">{errors.precio.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Controller
              name="proveedorId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores
                      .filter(p => p.estado)
                      .map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombreComercial}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.proveedorId && (
              <p className="text-sm text-red-500">{errors.proveedorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="existencia">Existencia</Label>
            <Input
              id="existencia"
              type="number"
              {...register("existencia", { valueAsNumber: true })}
              placeholder="0"
              min="0"
            />
            {errors.existencia && (
              <p className="text-sm text-red-500">{errors.existencia.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estado"
              checked={watch("estado")}
              onCheckedChange={(checked) => setValue("estado", !!checked)}
            />
            <Label htmlFor="estado" className="cursor-pointer">
              Activo
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingItem ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CrudDialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Eliminar Artículo"
        description={`¿Está seguro que desea eliminar el artículo "${itemToDelete?.descripcion}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}