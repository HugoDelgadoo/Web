import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RolAplicacion = 'Admin' | 'Empleado';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly claveRol = 'rol_aplicacion';
  private readonly claveSesion = 'sesion_usuario';
  private readonly rolActualSubject = new BehaviorSubject<RolAplicacion>(this.obtenerRolActual());
  readonly rolActual$ = this.rolActualSubject.asObservable();

  obtenerRolActual(): RolAplicacion {
    const sesionTexto = localStorage.getItem(this.claveSesion);
    if (sesionTexto) {
      try {
        const sesion = JSON.parse(sesionTexto) as { rol?: string };
        if (sesion.rol === 'Admin') return 'Admin';
        if (sesion.rol === 'Empleado') return 'Empleado';
      } catch {
        // Si la sesion no se puede leer, se usa el respaldo de rol local.
      }
    }
    const rolGuardado = localStorage.getItem(this.claveRol);
    return rolGuardado === 'Admin' ? 'Admin' : 'Empleado';
  }

  guardarRol(rol: RolAplicacion): void {
    localStorage.setItem(this.claveRol, rol);
    this.rolActualSubject.next(rol);
  }
}
