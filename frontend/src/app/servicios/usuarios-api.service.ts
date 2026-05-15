import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioCrear } from '../modelos/usuario';
import { crearCabecerasConRol } from './cabeceras-rol';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private readonly urlUsuarios = `${environment.urlApi}/usuarios`;

  constructor(
    private readonly clienteHttp: HttpClient,
    private readonly rolService: RolService
  ) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.clienteHttp.get<Usuario[]>(this.urlUsuarios, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  crearUsuario(usuario: UsuarioCrear): Observable<Usuario> {
    return this.clienteHttp.post<Usuario>(this.urlUsuarios, usuario, {
      headers: crearCabecerasConRol(this.rolService)
    });
  }

  eliminarUsuario(idUsuario: number): Observable<{ mensaje: string; id_usuario: number }> {
    return this.clienteHttp.delete<{ mensaje: string; id_usuario: number }>(
      `${this.urlUsuarios}/${idUsuario}`,
      { headers: crearCabecerasConRol(this.rolService) }
    );
  }
}
