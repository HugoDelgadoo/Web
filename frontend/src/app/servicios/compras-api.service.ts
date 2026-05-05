import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemListaPedido } from '../modelos/compra';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ComprasApiService {
  private readonly urlCompras = `${environment.urlApi}/compras`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  private crearCabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Rol': this.rolService.obtenerRolActual() });
  }

  obtenerListaPedido(): Observable<ItemListaPedido[]> {
    return this.clienteHttp.get<ItemListaPedido[]>(`${this.urlCompras}/lista-pedido`, {
      headers: this.crearCabeceras()
    });
  }

  generarPedido(observaciones = ''): Observable<{ mensaje: string; id_pedido_compra: number | null }> {
    return this.clienteHttp.post<{ mensaje: string; id_pedido_compra: number | null }>(
      `${this.urlCompras}/generar-pedido?observaciones=${encodeURIComponent(observaciones)}`,
      {},
      { headers: this.crearCabeceras() }
    );
  }
}
