export interface ItemListaPedido {
  id_producto: number;
  nombre_producto: string;
  stock_actual: number;
  stock_minimo: number;
  cantidad_sugerida: number;
  id_proveedor?: number | null;
}
