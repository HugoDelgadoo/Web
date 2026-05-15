import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ResumenDashboard } from '../modelos/dashboard';
import { I18nPipe } from '../pipes/i18n.pipe';
import { DashboardApiService } from '../servicios/dashboard-api.service';
import { RolService } from '../servicios/rol.service';

@Component({
  selector: 'app-pagina-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, I18nPipe],
  templateUrl: './pagina-dashboard.component.html',
  styleUrl: './pagina-dashboard.component.css'
})
export class PaginaDashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) grafico?: BaseChartDirective;
  private readonly destroyRef = inject(DestroyRef);

  resumen: ResumenDashboard = { ventas_del_dia: 0, total_acumulado: 0, alertas_stock_bajo: 0 };
  mensajeError = '';

  configuracionLinea: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas diarias (EUR)',
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
    this.rolService.rolActual$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cargarResumen();
        this.cargarTendencia();
      });
  }

  private cargarResumen(): void {
    this.dashboardApiService.obtenerResumen().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'err_dashboard_summary')
    });
  }

  private cargarTendencia(): void {
    this.dashboardApiService.obtenerTendencia(14).subscribe({
      next: (datos) => {
        // Dejamos el grafico listo con etiquetas y valores en una sola pasada.
        const etiquetas = datos.map((p) => p.fecha);
        const valores = datos.map((p) => Number(p.total) || 0);
        this.configuracionLinea = {
          labels: etiquetas,
          datasets: [
            {
              ...this.configuracionLinea.datasets[0],
              data: valores
            }
          ]
        };
        this.grafico?.update();
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'err_dashboard_trend')
    });
  }
}
