import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proveedor, ProveedorCrear } from '../modelos/proveedor';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ProveedoresApiService {
  private readonly urlProveedores = `${environment.urlApi}/proveedores`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  listarProveedores(): Observable<Proveedor[]> {
    return this.clienteHttp.get<Proveedor[]>(this.urlProveedores, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  crearProveedor(proveedor: ProveedorCrear): Observable<Proveedor> {
    return this.clienteHttp.post<Proveedor>(this.urlProveedores, proveedor, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  eliminarProveedor(idProveedor: number): Observable<{ mensaje: string; id_proveedor: number }> {
    return this.clienteHttp.delete<{ mensaje: string; id_proveedor: number }>(
      `${this.urlProveedores}/${idProveedor}`,
      { headers: crearCabecerasConRol(this.rolService) }
    );
  }
}
