import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ProductoCrear } from '../modelos/producto';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private readonly urlProductos = `${environment.urlApi}/productos`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  listarProductos(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(this.urlProductos, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  crearProducto(producto: ProductoCrear): Observable<Producto> {
    return this.clienteHttp.post<Producto>(this.urlProductos, producto, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  listarProximosCaducar(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(`${this.urlProductos}/proximos-caducar`, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }
}
