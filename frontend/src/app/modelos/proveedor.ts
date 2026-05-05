export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  categoria: string;
  activo: boolean;
}

export interface ProveedorCrear {
  nombre: string;
  contacto: string;
  categoria: string;
  activo: boolean;
}
