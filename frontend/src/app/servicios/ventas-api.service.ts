import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Venta, VentaCrear } from '../modelos/venta';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class VentasApiService {
  private readonly urlVentas = `${environment.urlApi}/ventas`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  listarVentas(): Observable<Venta[]> {
    return this.clienteHttp.get<Venta[]>(this.urlVentas, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  crearVenta(venta: VentaCrear): Observable<Venta> {
    return this.clienteHttp.post<Venta>(this.urlVentas, venta, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  eliminarVenta(idVenta: number): Observable<{ mensaje: string; id_venta: number }> {
    return this.clienteHttp.delete<{ mensaje: string; id_venta: number }>(`${this.urlVentas}/${idVenta}`, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }
}
