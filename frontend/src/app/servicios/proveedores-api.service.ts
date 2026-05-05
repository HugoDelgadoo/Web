import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proveedor, ProveedorCrear } from '../modelos/proveedor';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class ProveedoresApiService {
  private readonly urlProveedores = `${environment.urlApi}/proveedores`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  private crearCabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Rol': this.rolService.obtenerRolActual() });
  }

  listarProveedores(): Observable<Proveedor[]> {
    return this.clienteHttp.get<Proveedor[]>(this.urlProveedores, {
      headers: this.crearCabeceras()
    });
  }

  crearProveedor(proveedor: ProveedorCrear): Observable<Proveedor> {
    return this.clienteHttp.post<Proveedor>(this.urlProveedores, proveedor, {
      headers: this.crearCabeceras()
    });
  }
}
