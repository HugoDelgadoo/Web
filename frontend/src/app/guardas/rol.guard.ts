import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolAplicacion } from '../servicios/rol.service';
import { SesionService } from '../servicios/sesion.service';

export const guardaRol: CanActivateFn = (ruta) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);
  const rolesPermitidos = (ruta.data?.['roles'] as RolAplicacion[] | undefined) ?? [];
  if (!sesionService.estaAutenticado()) return router.createUrlTree(['/login']);
  if (rolesPermitidos.length === 0) return true;
  return rolesPermitidos.includes(sesionService.obtenerRolActual())
    ? true
    : router.createUrlTree(['/ventas']);
};
