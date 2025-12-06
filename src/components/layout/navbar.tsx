import Link from 'next/link';
import { Coffee, Home } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Coffee className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Cafetería UNAPEC</h1>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          <Link 
            href="/"
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            <Home className="h-4 w-4" />
          </Link>
          <Link 
            href="/tipos-usuarios" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            Tipos Usuarios
          </Link>
          <Link 
            href="/marcas" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            Marcas
          </Link>
          <Link 
            href="/campus" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            Campus
          </Link>
          <Link 
            href="/proveedores" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            Proveedores
          </Link>
        </div>
      </div>
    </nav>
  );
}