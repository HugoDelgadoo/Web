import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../modelos/usuario';
import { RolService } from '../servicios/rol.service';
import { UsuariosApiService } from '../servicios/usuarios-api.service';

@Component({
  selector: 'app-pagina-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagina-usuarios.component.html',
  styleUrl: './pagina-usuarios.component.css'
})
export class PaginaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensajeError = '';
  mensajeExito = '';
  formularioUsuario!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usuariosApiService: UsuariosApiService,
    private readonly rolService: RolService
  ) {
    this.formularioUsuario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['Empleado', [Validators.required]],
      activo: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.rolService.rolActual$.subscribe(() => this.cargarUsuarios());
  }

  cargarUsuarios(): void {
    this.usuariosApiService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'No se pudo cargar usuarios (requiere rol Admin).')
    });
  }

  crearUsuario(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }
    const valor = this.formularioUsuario.getRawValue();
    this.usuariosApiService
      .crearUsuario({
        nombre: valor.nombre ?? '',
        email: valor.email ?? '',
        rol: (valor.rol as 'Admin' | 'Empleado') ?? 'Empleado',
        activo: Boolean(valor.activo)
      })
      .subscribe({
        next: () => {
          this.mensajeExito = 'Usuario creado correctamente.';
          this.mensajeError = '';
          this.cargarUsuarios();
        },
        error: () => (this.mensajeError = 'No se pudo crear el usuario.')
      });
  }
}
