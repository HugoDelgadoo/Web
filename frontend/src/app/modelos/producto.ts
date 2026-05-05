export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  fecha_caducidad?: string | null;
}

export interface ProductoCrear {
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  fecha_caducidad?: string | null;
}
