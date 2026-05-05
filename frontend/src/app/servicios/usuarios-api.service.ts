import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioCrear } from '../modelos/usuario';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private readonly urlUsuarios = `${environment.urlApi}/usuarios`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  private crearCabeceras(): HttpHeaders {
    return new HttpHeaders({ 'X-Rol': this.rolService.obtenerRolActual() });
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.clienteHttp.get<Usuario[]>(this.urlUsuarios, {
      headers: this.crearCabeceras()
    });
  }

  crearUsuario(usuario: UsuarioCrear): Observable<Usuario> {
    return this.clienteHttp.post<Usuario>(this.urlUsuarios, usuario, {
      headers: this.crearCabeceras()
    });
  }
}
