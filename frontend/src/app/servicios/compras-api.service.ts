import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemListaPedido } from '../modelos/compra';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ComprasApiService {
  private readonly urlCompras = `${environment.urlApi}/compras`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  obtenerListaPedido(): Observable<ItemListaPedido[]> {
    return this.clienteHttp.get<ItemListaPedido[]>(`${this.urlCompras}/lista-pedido`, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  generarPedido(observaciones = ''): Observable<{ mensaje: string; id_pedido_compra: number | null }> {
    return this.clienteHttp.post<{ mensaje: string; id_pedido_compra: number | null }>(
      `${this.urlCompras}/generar-pedido?observaciones=${encodeURIComponent(observaciones)}`,
      {},
      { headers: crearCabecerasConRol(this.rolService) }
    );
  }
}
