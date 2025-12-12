"use client";

import { useState, useEffect } from "react";
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
import { Empleado } from "@/types";
import { EmpleadosService } from "@/services/empleados.service";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cedula: z.string().length(11, "La cédula debe tener 11 dígitos").regex(/^\d+$/, "La cédula debe contener solo números"),
  tandaLabor: z.enum(['matutina', 'vespertina', 'nocturna']),
  porcientoComision: z.number().min(0, "La comisión no puede ser negativa").max(100, "La comisión no puede ser mayor a 100"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function EmpleadosPage() {
  const [data, setData] = useState<Empleado[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Empleado | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Empleado | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const empleados = EmpleadosService.getAll();
    setData(empleados);
  };

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
      tandaLabor: 'matutina',
      porcientoComision: 0,
    },
  });

  const columns = [
    { key: "id" as keyof Empleado, label: "ID" },
    { key: "nombre" as keyof Empleado, label: "Nombre" },
    { key: "cedula" as keyof Empleado, label: "Cédula" },
    { 
      key: "tandaLabor" as keyof Empleado, 
      label: "Tanda",
      render: (value: string) => {
        const tandas = {
          matutina: 'Matutina',
          vespertina: 'Vespertina',
          nocturna: 'Nocturna'
        };
        return tandas[value as keyof typeof tandas] || value;
      }
    },
    { 
      key: "porcientoComision" as keyof Empleado, 
      label: "Comisión",
      render: (value: number) => `${value}%`
    },
    { 
      key: "fechaIngreso" as keyof Empleado, 
      label: "Fecha Ingreso",
      render: (value: Date) => {
        const date = new Date(value);
        return date.toLocaleDateString('es-DO');
      }
    },
    { key: "estado" as keyof Empleado, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ 
      nombre: "", 
      cedula: "", 
      tandaLabor: 'matutina',
      porcientoComision: 0,
      estado: true 
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Empleado) => {
    setEditingItem(item);
    setValue("nombre", item.nombre);
    setValue("cedula", item.cedula);
    setValue("tandaLabor", item.tandaLabor);
    setValue("porcientoComision", item.porcientoComision);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Empleado) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      EmpleadosService.delete(itemToDelete.id);
      loadData();
      showMessage('success', 'El empleado ha sido eliminado correctamente.');
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const onSubmit = (formData: FormData) => {
    try {
      if (editingItem) {
        EmpleadosService.update(editingItem.id, formData);
        showMessage('success', 'El empleado ha sido actualizado correctamente.');
      } else {
        EmpleadosService.create(formData);
        showMessage('success', 'El empleado ha sido creado correctamente.');
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      showMessage('error', 'Ocurrió un error al guardar los datos.');
    }
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
        searchKey="nombre"
        searchPlaceholder="Buscar empleado..."
        title="Empleados"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Empleado" : "Nuevo Empleado"}
        description="Complete la información del empleado"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              {...register("nombre")}
              placeholder="Nombre completo"
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              {...register("cedula")}
              placeholder="00111222333"
              maxLength={11}
            />
            {errors.cedula && (
              <p className="text-sm text-red-500">{errors.cedula.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tandaLabor">Tanda Labor</Label>
            <Controller
              name="tandaLabor"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tanda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutina">Matutina</SelectItem>
                    <SelectItem value="vespertina">Vespertina</SelectItem>
                    <SelectItem value="nocturna">Nocturna</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tandaLabor && (
              <p className="text-sm text-red-500">{errors.tandaLabor.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="porcientoComision">Porciento de Comisión (%)</Label>
            <Input
              id="porcientoComision"
              type="number"
              {...register("porcientoComision", { valueAsNumber: true })}
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
            {errors.porcientoComision && (
              <p className="text-sm text-red-500">{errors.porcientoComision.message}</p>
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
        title="Eliminar Empleado"
        description={`¿Está seguro que desea eliminar el empleado "${itemToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}