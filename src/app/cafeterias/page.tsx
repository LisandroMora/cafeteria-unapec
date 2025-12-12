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
import { Cafeteria, Campus } from "@/types";
import { CafeteriasService } from "@/services/cafeterias.service";
import { CampusService } from "@/services/campus.service";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  campusId: z.string().min(1, "Debe seleccionar un campus"),
  encargado: z.string().min(3, "El nombre del encargado debe tener al menos 3 caracteres"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function CafeteriasPage() {
  const [data, setData] = useState<Cafeteria[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cafeteria | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Cafeteria | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const cafeterias = CafeteriasService.getAll();
    const campusList = CampusService.getAll();
    setData(cafeterias);
    setCampus(campusList);
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
    },
  });

  const columns = [
    { key: "id" as keyof Cafeteria, label: "ID" },
    { key: "descripcion" as keyof Cafeteria, label: "Descripción" },
    {
      key: "campusId" as keyof Cafeteria,
      label: "Campus",
      render: (value: string) => {
        const campusItem = campus.find(c => c.id === value);
        return campusItem?.descripcion || value;
      }
    },
    { key: "encargado" as keyof Cafeteria, label: "Encargado" },
    { key: "estado" as keyof Cafeteria, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ descripcion: "", campusId: "", encargado: "", estado: true });
    setDialogOpen(true);
  };

  const handleEdit = (item: Cafeteria) => {
    setEditingItem(item);
    setValue("descripcion", item.descripcion);
    setValue("campusId", item.campusId);
    setValue("encargado", item.encargado);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Cafeteria) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      CafeteriasService.delete(itemToDelete.id);
      loadData();
      showMessage('success', 'La cafetería ha sido eliminada correctamente.');
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
        CafeteriasService.update(editingItem.id, formData);
        showMessage('success', 'La cafetería ha sido actualizada correctamente.');
      } else {
        CafeteriasService.create(formData);
        showMessage('success', 'La cafetería ha sido creada correctamente.');
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
        searchKey="descripcion"
        searchPlaceholder="Buscar cafetería..."
        title="Cafeterías"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Cafetería" : "Nueva Cafetería"}
        description="Complete la información de la cafetería"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              {...register("descripcion")}
              placeholder="Ej: Cafetería Principal"
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="campus">Campus</Label>
            <Controller
              name="campusId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campus
                      .filter(c => c.estado)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.descripcion}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.campusId && (
              <p className="text-sm text-red-500">{errors.campusId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="encargado">Encargado</Label>
            <Input
              id="encargado"
              {...register("encargado")}
              placeholder="Nombre del encargado"
            />
            {errors.encargado && (
              <p className="text-sm text-red-500">{errors.encargado.message}</p>
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
        title="Eliminar Cafetería"
        description={`¿Está seguro que desea eliminar la cafetería "${itemToDelete?.descripcion}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}