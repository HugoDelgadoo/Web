import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RolAplicacion } from './servicios/rol.service';
import { SesionService } from './servicios/sesion.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  nombreAplicacion = 'Gestoria de Inventario y Ventas';
  rolActual: RolAplicacion = 'Empleado';
  usuarioNombre = '';
  autenticado = false;

  constructor(
    private readonly sesionService: SesionService,
    private readonly router: Router
  ) {
    this.sesionService.usuarioActual$.subscribe((usuario) => {
      this.autenticado = !!usuario;
      this.rolActual = usuario?.rol ?? 'Empleado';
      this.usuarioNombre = usuario?.nombre ?? '';
    });
  }

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }
}
