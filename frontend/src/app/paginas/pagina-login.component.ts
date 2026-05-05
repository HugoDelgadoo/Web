import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-pagina-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagina-login.component.html',
  styleUrl: './pagina-login.component.css'
})
export class PaginaLoginComponent {
  mensajeError = '';
  cargando = false;
  formularioLogin!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sesionService: SesionService,
    private readonly router: Router
  ) {
    this.formularioLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      clave_acceso: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  iniciarSesion(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }
    const valor = this.formularioLogin.getRawValue();
    this.cargando = true;
    this.mensajeError = '';
    this.sesionService
      .iniciarSesion({
        email: (valor.email ?? '').trim().toLowerCase(),
        clave_acceso: valor.clave_acceso ?? ''
      })
      .subscribe({
        next: (usuario) => {
          this.cargando = false;
          const destino = usuario.rol === 'Admin' ? '/dashboard' : '/ventas';
          void this.router.navigateByUrl(destino);
        },
        error: () => {
          this.cargando = false;
          this.mensajeError = 'Credenciales incorrectas o usuario sin acceso.';
        }
      });
  }
}
