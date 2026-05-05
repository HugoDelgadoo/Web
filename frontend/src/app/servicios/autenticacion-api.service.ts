import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CredencialesInicioSesion, UsuarioSesion } from '../modelos/sesion';

@Injectable({ providedIn: 'root' })
export class AutenticacionApiService {
  private readonly urlAuth = `${environment.urlApi}/auth`;

  constructor(private readonly clienteHttp: HttpClient) {}

  iniciarSesion(credenciales: CredencialesInicioSesion): Observable<UsuarioSesion> {
    return this.clienteHttp.post<UsuarioSesion>(`${this.urlAuth}/login`, credenciales);
  }
}
