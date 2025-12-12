"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Tag, MapPin, Truck, Package, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  // Datos simulados para los gráficos
  const ventasPorDia = [
    { dia: 'Lun', ventas: 4500 },
    { dia: 'Mar', ventas: 5200 },
    { dia: 'Mie', ventas: 4800 },
    { dia: 'Jue', ventas: 6100 },
    { dia: 'Vie', ventas: 7200 },
    { dia: 'Sab', ventas: 3500 },
    { dia: 'Dom', ventas: 2800 },
  ];

  const productosMasVendidos = [
    { nombre: 'Café', cantidad: 450, color: '#8B4513' },
    { nombre: 'Sandwich', cantidad: 320, color: '#FFA500' },
    { nombre: 'Jugos', cantidad: 280, color: '#FF6347' },
    { nombre: 'Empanadas', cantidad: 200, color: '#FFD700' },
    { nombre: 'Dulces', cantidad: 150, color: '#9370DB' },
  ];

  const ventasPorCampus = [
    { campus: 'Campus I', ventas: 5000 },
    { campus: 'Campus II', ventas: 1200 },
    { campus: 'Campus III', ventas: 9000 },
    { campus: 'Santiago', ventas: 5500 },
  ];

  const stats = [
    {
      title: 'Ventas Hoy',
      value: 'RD$ 5,234',
      change: '+2.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Transacciones',
      value: '12',
      change: '+8.2%',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Productos Activos',
      value: '15',
      change: '+2.3%',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Usuarios Activos',
      value: '14',
      change: '+15.3%',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard - Sistema de Cafetería UNAPEC
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen de actividad y estadísticas del día
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 font-medium">{stat.change}</span> vs. ayer
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ventas por Campus */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Campus</CardTitle>
            <CardDescription>
              Distribución de ventas mensuales por ubicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ventasPorCampus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campus" />
                <YAxis />
                <Tooltip formatter={(value) => `RD$ ${value}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-sm">Tipos de Usuarios</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500">
            <CardHeader className="text-center">
              <Tag className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-sm">Marcas</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-500">
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-sm">Campus</CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-orange-500">
            <CardHeader className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <CardTitle className="text-sm">Proveedores</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}