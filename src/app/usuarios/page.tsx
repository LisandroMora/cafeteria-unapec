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
import { Usuario, TipoUsuario } from "@/types";
import { UsuariosService } from "@/services/usuarios.service";
import { TiposUsuariosService } from "@/services/tipos-usuarios.service";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cedula: z.string().length(11, "La cédula debe tener 11 dígitos").regex(/^\d+$/, "La cédula debe contener solo números"),
  tipoUsuarioId: z.string().min(1, "Debe seleccionar un tipo de usuario"),
  limiteCredito: z.number().min(0, "El límite de crédito no puede ser negativo"),
  estado: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function UsuariosPage() {
  const [data, setData] = useState<Usuario[]>([]);
  const [tiposUsuarios, setTiposUsuarios] = useState<TipoUsuario[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Usuario | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Usuario | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usuarios = UsuariosService.getAll();
    const tipos = TiposUsuariosService.getAll();
    setData(usuarios);
    setTiposUsuarios(tipos);
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
      limiteCredito: 0,
    },
  });

  const columns = [
    { key: "id" as keyof Usuario, label: "ID" },
    { key: "nombre" as keyof Usuario, label: "Nombre" },
    { key: "cedula" as keyof Usuario, label: "Cédula" },
    {
      key: "tipoUsuarioId" as keyof Usuario,
      label: "Tipo de Usuario",
      render: (value: string) => {
        const tipo = tiposUsuarios.find(t => t.id === value);
        return tipo?.descripcion || value;
      }
    },
    { 
      key: "limiteCredito" as keyof Usuario, 
      label: "Límite de Crédito",
      render: (value: number) => `RD$ ${value.toLocaleString()}`
    },
    { key: "fechaRegistro" as keyof Usuario, label: "Fecha Registro" },
    { key: "estado" as keyof Usuario, label: "Estado" },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    reset({ nombre: "", cedula: "", tipoUsuarioId: "", limiteCredito: 0, estado: true });
    setDialogOpen(true);
  };

  const handleEdit = (item: Usuario) => {
    setEditingItem(item);
    setValue("nombre", item.nombre);
    setValue("cedula", item.cedula);
    setValue("tipoUsuarioId", item.tipoUsuarioId);
    setValue("limiteCredito", item.limiteCredito);
    setValue("estado", item.estado);
    setDialogOpen(true);
  };

  const handleDelete = (item: Usuario) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      UsuariosService.delete(itemToDelete.id);
      loadData();
      showMessage('success', 'El usuario ha sido eliminado correctamente.');
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
        UsuariosService.update(editingItem.id, formData);
        showMessage('success', 'El usuario ha sido actualizado correctamente.');
      } else {
        UsuariosService.create(formData);
        showMessage('success', 'El usuario ha sido creado correctamente.');
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
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
        searchPlaceholder="Buscar usuario..."
        title="Usuarios"
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        title={editingItem ? "Editar Usuario" : "Nuevo Usuario"}
        description="Complete la información del usuario"
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
            <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
            <Controller
              name="tipoUsuarioId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposUsuarios
                      .filter(t => t.estado)
                      .map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          {tipo.descripcion}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipoUsuarioId && (
              <p className="text-sm text-red-500">{errors.tipoUsuarioId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="limiteCredito">Límite de Crédito</Label>
            <Input
              id="limiteCredito"
              type="number"
              {...register("limiteCredito", { valueAsNumber: true })}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.limiteCredito && (
              <p className="text-sm text-red-500">{errors.limiteCredito.message}</p>
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
        title="Eliminar Usuario"
        description={`¿Está seguro que desea eliminar el usuario "${itemToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        confirmVariant="destructive"
      />
    </MainLayout>
  );
}