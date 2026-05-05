import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proveedor } from '../modelos/proveedor';
import { ProveedoresApiService } from '../servicios/proveedores-api.service';
import { RolService } from '../servicios/rol.service';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-pagina-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagina-proveedores.component.html',
  styleUrl: './pagina-proveedores.component.css'
})
export class PaginaProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  mensajeError = '';
  esAdmin = false;
  formularioProveedor!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly proveedoresApiService: ProveedoresApiService,
    private readonly rolService: RolService,
    private readonly sesionService: SesionService
  ) {
    this.formularioProveedor = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      contacto: ['', [Validators.required, Validators.minLength(4)]],
      categoria: ['', [Validators.required, Validators.minLength(2)]],
      activo: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.esAdmin = this.sesionService.obtenerRolActual() === 'Admin';
    this.cargarProveedores();
    this.rolService.rolActual$.subscribe((rol) => {
      this.esAdmin = rol === 'Admin';
      this.cargarProveedores();
    });
  }

  cargarProveedores(): void {
    this.proveedoresApiService.listarProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'No se pudo cargar proveedores (requiere rol Admin).')
    });
  }

  crearProveedor(): void {
    if (this.formularioProveedor.invalid) {
      this.formularioProveedor.markAllAsTouched();
      return;
    }
    const valor = this.formularioProveedor.getRawValue();
    this.proveedoresApiService
      .crearProveedor({
        nombre: valor.nombre ?? '',
        contacto: valor.contacto ?? '',
        categoria: valor.categoria ?? '',
        activo: Boolean(valor.activo)
      })
      .subscribe({
        next: () => this.cargarProveedores(),
        error: () => (this.mensajeError = 'No se pudo crear el proveedor.')
      });
  }
}
