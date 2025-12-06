"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Home, Users, Tag, MapPin, Truck, Menu, Store, Package, UserCheck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  {
    title: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    title: 'Cafeterías',
    href: '/cafeterias',
    icon: Store,
  },
  {
    title: 'Tipos de Usuarios',
    href: '/tipos-usuarios',
    icon: Users,
  },
  {
    title: 'Usuarios',
    href: '/usuarios',
    icon: UserCheck,
  },
  {
    title: 'Marcas',
    href: '/marcas',
    icon: Tag,
  },
  {
    title: 'Campus',
    href: '/campus',
    icon: MapPin,
  },
  {
    title: 'Proveedores',
    href: '/proveedores',
    icon: Truck,
  },
  {
    title: 'Artículos',
    href: '/articulos',
    icon: Package,
  },
  {
    title: 'Empleados',
    href: '/empleados',
    icon: Users,
  },
  {
    title: 'Ventas',
    href: '/ventas',
    icon: ShoppingCart,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Coffee className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold">Cafetería UNAPEC</h2>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  pathname === item.href && 'bg-blue-100 text-blue-900'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-white">
        <SidebarContent />
      </aside>
    </>
  );
}