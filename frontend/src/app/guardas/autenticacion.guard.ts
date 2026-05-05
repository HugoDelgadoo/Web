import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../servicios/sesion.service';

export const guardaAutenticacion: CanActivateFn = () => {
  const sesionService = inject(SesionService);
  const router = inject(Router);
  if (sesionService.estaAutenticado()) return true;
  return router.createUrlTree(['/login']);
};
