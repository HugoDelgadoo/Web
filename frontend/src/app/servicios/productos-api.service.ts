import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ProductoCrear } from '../modelos/producto';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private readonly urlProductos = `${environment.urlApi}/productos`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  private crearCabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Rol': this.rolService.obtenerRolActual() });
  }

  listarProductos(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(this.urlProductos, { headers: this.crearCabeceras() });
  }

  crearProducto(producto: ProductoCrear): Observable<Producto> {
    return this.clienteHttp.post<Producto>(this.urlProductos, producto, {
      headers: this.crearCabeceras()
    });
  }

  listarProximosCaducar(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(`${this.urlProductos}/proximos-caducar`, {
      headers: this.crearCabeceras()
    });
  }
}
