import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CredencialesInicioSesion, UsuarioSesion } from '../modelos/sesion';
import { AutenticacionApiService } from './autenticacion-api.service';
import { RolService } from './rol.service';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly claveSesion = 'sesion_usuario';
  private readonly usuarioActualSubject = new BehaviorSubject<UsuarioSesion | null>(this.cargarSesion());
  readonly usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(
    private readonly autenticacionApiService: AutenticacionApiService,
    private readonly rolService: RolService
  ) {}

  estaAutenticado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }

  obtenerRolActual() {
    return this.usuarioActualSubject.value?.rol ?? 'Empleado';
  }

  obtenerUsuarioActual() {
    return this.usuarioActualSubject.value;
  }

  iniciarSesion(credenciales: CredencialesInicioSesion): Observable<UsuarioSesion> {
    return this.autenticacionApiService.iniciarSesion(credenciales).pipe(
      tap((usuario) => {
        localStorage.setItem(this.claveSesion, JSON.stringify(usuario));
        this.rolService.guardarRol(usuario.rol);
        this.usuarioActualSubject.next(usuario);
      })
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.claveSesion);
    this.rolService.guardarRol('Empleado');
    this.usuarioActualSubject.next(null);
  }

  private cargarSesion(): UsuarioSesion | null {
    const texto = localStorage.getItem(this.claveSesion);
    if (!texto) return null;
    try {
      return JSON.parse(texto) as UsuarioSesion;
    } catch {
      return null;
    }
  }
}
