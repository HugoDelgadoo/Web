import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RolAplicacion = 'Admin' | 'Empleado';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly claveRol = 'rol_aplicacion';
  private readonly rolActualSubject = new BehaviorSubject<RolAplicacion>(this.obtenerRolActual());
  readonly rolActual$ = this.rolActualSubject.asObservable();

  obtenerRolActual(): RolAplicacion {
    const rolGuardado = localStorage.getItem(this.claveRol);
    return rolGuardado === 'Admin' ? 'Admin' : 'Empleado';
  }

  guardarRol(rol: RolAplicacion): void {
    localStorage.setItem(this.claveRol, rol);
    this.rolActualSubject.next(rol);
  }
}
