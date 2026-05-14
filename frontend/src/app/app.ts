import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { I18nPipe } from './pipes/i18n.pipe';
import { IdiomaService } from './servicios/idioma.service';
import { RolAplicacion } from './servicios/rol.service';
import { SesionService } from './servicios/sesion.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, I18nPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  rolActual: RolAplicacion = 'Empleado';
  usuarioNombre = '';
  autenticado = false;
  mostrarShell = false;
  idiomaActual = 'es';

  constructor(
    private readonly sesionService: SesionService,
    private readonly router: Router,
    private readonly idiomaService: IdiomaService
  ) {
    this.sesionService.usuarioActual$.subscribe((usuario) => {
      this.autenticado = !!usuario;
      this.rolActual = usuario?.rol ?? 'Empleado';
      this.usuarioNombre = usuario?.nombre ?? '';
      this.mostrarShell = this.autenticado && !this.router.url.startsWith('/login');
    });
    this.idiomaActual = this.idiomaService.obtenerIdioma();
    this.idiomaService.idiomaActual$.subscribe((idioma) => (this.idiomaActual = idioma));
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.mostrarShell = this.autenticado && !this.router.url.startsWith('/login');
      });
  }

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }

  cambiarIdioma(): void {
    this.idiomaService.cambiarIdioma();
  }
}
