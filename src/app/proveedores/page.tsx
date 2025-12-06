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
import { Proveedor } from "@/types";
import { proveedores as initialData } from "@/lib/mock-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nombreComercial: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  rnc: z.string().length(9, "El RNC debe tener exactamente 9 dígitos").regex(/^\d+$/, "El RNC debe contener solo números"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProveedoresPage() {
  const [data, setData] = useState<Proveedor[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Proveedor | null>(null);

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
    { key: "id" as keyof Proveedor, label: "ID" },
    { key: "nombreComercial" as keyof Proveedor, label: "Nombre Comercial" },
    { key: "rnc" as keyof Proveedor, label: "RNC" },
    { key: "fechaRegistro" as keyof Proveedor, label: "Fecha Registro" },
    { key: "estado" as keyof Proveedor, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ nombreComercial: "", rnc: "", estado: true });
    setDialogOpen(true);
  };

  const handleEdit = (item: Proveedor) => {
    setEditingItem(item);
    setValue("nombreComercial", item.nombreComercial);
    setValue("rnc", item.rnc);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Proveedor) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((d) => d.id !== itemToDelete.id));
      showMessage('success', 'El proveedor ha sido eliminado correctamente.');
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
      showMessage('success', 'El proveedor ha sido actualizado correctamente.');
    } else {
      const newItem: Proveedor = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date(),
      };
      setData([...data, newItem]);
      showMessage('success', 'El proveedor ha sido creado correctamente.');
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
        searchKey="nombreComercial"
        searchPlaceholder="Buscar proveedor..."
        title="Proveedores"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Proveedor" : "Nuevo Proveedor"}
        description="Complete la información del proveedor"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreComercial">Nombre Comercial</Label>
            <Input
              id="nombreComercial"
              {...register("nombreComercial")}
              placeholder="Ej: Distribuidora Nacional"
            />
            {errors.nombreComercial && (
              <p className="text-sm text-red-500">{errors.nombreComercial.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rnc">RNC</Label>
            <Input
              id="rnc"
              {...register("rnc")}
              placeholder="123456789"
              maxLength={9}
            />
            {errors.rnc && (
              <p className="text-sm text-red-500">{errors.rnc.message}</p>
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
        title="Eliminar Proveedor"
        description={`¿Está seguro que desea eliminar el proveedor "${itemToDelete?.nombreComercial}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}