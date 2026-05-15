import { HttpHeaders } from '@angular/common/http';
import { RolService } from './rol.service';

export function crearCabecerasConRol(rolService: RolService): HttpHeaders {
  // Todas las llamadas al backend viajan con el rol activo.
  return new HttpHeaders({ 'X-Rol': rolService.obtenerRolActual() });
}
