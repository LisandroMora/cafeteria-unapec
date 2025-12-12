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
import { Campus } from "@/types";
import { CampusService } from "@/services/campus.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function CampusPage() {
  const [data, setData] = useState<Campus[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Campus | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Campus | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = CampusService.getAll();
    setData(items);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: true,
    },
  });

  const columns = [
    { key: "id" as keyof Campus, label: "ID" },
    { key: "descripcion" as keyof Campus, label: "Descripción" },
    { key: "estado" as keyof Campus, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ descripcion: "", estado: true });
    setDialogOpen(true);
  };

  const handleEdit = (item: Campus) => {
    setEditingItem(item);
    setValue("descripcion", item.descripcion);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Campus) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      CampusService.delete(itemToDelete.id);
      loadData();
      showMessage('success', 'El campus ha sido eliminado correctamente.');
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
        CampusService.update(editingItem.id, formData);
        showMessage('success', 'El campus ha sido actualizado correctamente.');
      } else {
        CampusService.create(formData);
        showMessage('success', 'El campus ha sido creado correctamente.');
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
        searchPlaceholder="Buscar campus..."
        title="Campus"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Campus" : "Nuevo Campus"}
        description="Complete la información del campus"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              {...register("descripcion")}
              placeholder="Ej: Campus I, Campus II, etc."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion.message}</p>
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
        title="Eliminar Campus"
        description={`¿Está seguro que desea eliminar el campus "${itemToDelete?.descripcion}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}