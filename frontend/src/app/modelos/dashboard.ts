export interface ResumenDashboard {
  ventas_del_dia: number;
  total_acumulado: number;
  alertas_stock_bajo: number;
}

export interface PuntoTendenciaVentas {
  fecha: string;
  total: number;
}
