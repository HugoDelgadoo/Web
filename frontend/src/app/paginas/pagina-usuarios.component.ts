import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../modelos/usuario';
import { I18nPipe } from '../pipes/i18n.pipe';
import { RolService } from '../servicios/rol.service';
import { UsuariosApiService } from '../servicios/usuarios-api.service';

@Component({
  selector: 'app-pagina-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, I18nPipe],
  templateUrl: './pagina-usuarios.component.html',
  styleUrl: './pagina-usuarios.component.css'
})
export class PaginaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensajeError = '';
  mensajeExito = '';
  guardando = false;
  formularioUsuario!: ReturnType<FormBuilder['group']>;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usuariosApiService: UsuariosApiService,
    private readonly rolService: RolService
  ) {
    this.formularioUsuario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['Empleado', [Validators.required]],
      activo: [true, [Validators.required]],
      clave_acceso: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.rolService.rolActual$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cargarUsuarios());
  }

  cargarUsuarios(): void {
    this.usuariosApiService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'err_users_load')
    });
  }

  crearUsuario(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }
    const valor = this.formularioUsuario.getRawValue();
    this.guardando = true;
    this.usuariosApiService
      .crearUsuario({
        nombre: valor.nombre ?? '',
        email: valor.email ?? '',
        rol: (valor.rol as 'Admin' | 'Empleado') ?? 'Empleado',
        activo: Boolean(valor.activo),
        clave_acceso: valor.clave_acceso ?? ''
      })
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'ok_user_create';
          this.mensajeError = '';
          this.formularioUsuario.reset({
            nombre: '',
            email: '',
            rol: 'Empleado',
            activo: true,
            clave_acceso: ''
          });
          this.cargarUsuarios();
        },
        error: () => {
          this.guardando = false;
          this.mensajeError = 'err_user_create';
        }
      });
  }

  eliminarUsuario(idUsuario: number): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.usuariosApiService.eliminarUsuario(idUsuario).subscribe({
      next: () => {
        this.mensajeExito = 'ok_user_delete';
        this.cargarUsuarios();
      },
      error: () => {
        this.mensajeError = 'err_user_delete';
      }
    });
  }
}
