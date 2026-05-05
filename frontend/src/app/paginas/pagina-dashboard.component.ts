import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardApiService } from '../servicios/dashboard-api.service';
import { ResumenDashboard } from '../modelos/dashboard';
import { RolService } from '../servicios/rol.service';

@Component({
  selector: 'app-pagina-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pagina-dashboard.component.html',
  styleUrl: './pagina-dashboard.component.css'
})
export class PaginaDashboardComponent implements OnInit {
  resumen: ResumenDashboard = { ventas_del_dia: 0, total_acumulado: 0, alertas_stock_bajo: 0 };
  mensajeError = '';

  configuracionLinea: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas diarias (€)',
        fill: true,
        tension: 0.35,
        borderColor: '#2f7cf6',
        backgroundColor: 'rgba(47,124,246,0.15)',
        pointBackgroundColor: '#245fcc'
      }
    ]
  };

  opcionesGrafico: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private readonly dashboardApiService: DashboardApiService,
    private readonly rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarTendencia();
    this.rolService.rolActual$.subscribe(() => {
      this.cargarResumen();
      this.cargarTendencia();
    });
  }

  private cargarResumen(): void {
    this.dashboardApiService.obtenerResumen().subscribe({
      next: (resumen) => (this.resumen = resumen),
      error: () => (this.mensajeError = 'No se pudo cargar el resumen del dashboard.')
    });
  }

  private cargarTendencia(): void {
    this.dashboardApiService.obtenerTendencia(14).subscribe({
      next: (datos) => {
        this.configuracionLinea.labels = datos.map((p) => p.fecha);
        this.configuracionLinea.datasets[0].data = datos.map((p) => p.total);
      },
      error: () => (this.mensajeError = 'No se pudo cargar la tendencia de ventas.')
    });
  }
}
