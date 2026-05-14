import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Venta, VentaCrear } from '../modelos/venta';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class VentasApiService {
  private readonly urlVentas = `${environment.urlApi}/ventas`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  private crearCabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Rol': this.rolService.obtenerRolActual() });
  }

  listarVentas(): Observable<Venta[]> {
    return this.clienteHttp.get<Venta[]>(this.urlVentas, { headers: this.crearCabeceras() });
  }

  crearVenta(venta: VentaCrear): Observable<Venta> {
    return this.clienteHttp.post<Venta>(this.urlVentas, venta, { headers: this.crearCabeceras() });
  }

  eliminarVenta(idVenta: number): Observable<{ mensaje: string; id_venta: number }> {
    return this.clienteHttp.delete<{ mensaje: string; id_venta: number }>(`${this.urlVentas}/${idVenta}`, {
      headers: this.crearCabeceras()
    });
  }
}
