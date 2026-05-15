import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PuntoTendenciaVentas, ResumenDashboard } from '../modelos/dashboard';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly urlDashboard = `${environment.urlApi}/dashboard`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  obtenerResumen(): Observable<ResumenDashboard> {
    return this.clienteHttp.get<ResumenDashboard>(`${this.urlDashboard}/resumen`, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  obtenerTendencia(dias = 14): Observable<PuntoTendenciaVentas[]> {
    return this.clienteHttp.get<PuntoTendenciaVentas[]>(
      `${this.urlDashboard}/tendencia-ventas?dias=${dias}`,
      { headers: crearCabecerasConRol(this.rolService) }
    );
  }
}
