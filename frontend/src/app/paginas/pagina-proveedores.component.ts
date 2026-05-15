import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proveedor } from '../modelos/proveedor';
import { I18nPipe } from '../pipes/i18n.pipe';
import { ProveedoresApiService } from '../servicios/proveedores-api.service';
import { RolService } from '../servicios/rol.service';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-pagina-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, I18nPipe],
  templateUrl: './pagina-proveedores.component.html',
  styleUrl: './pagina-proveedores.component.css'
})
export class PaginaProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  mensajeError = '';
  mensajeExito = '';
  esAdmin = false;
  guardando = false;
  formularioProveedor!: ReturnType<FormBuilder['group']>;
  private readonly destroyRef = inject(DestroyRef);

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
    this.rolService.rolActual$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rol) => {
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
      error: () => (this.mensajeError = 'err_providers_load')
    });
  }

  crearProveedor(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    if (this.formularioProveedor.invalid) {
      this.formularioProveedor.markAllAsTouched();
      return;
    }
    const valor = this.formularioProveedor.getRawValue();
    this.guardando = true;
    this.proveedoresApiService
      .crearProveedor({
        nombre: valor.nombre ?? '',
        contacto: valor.contacto ?? '',
        categoria: valor.categoria ?? '',
        activo: Boolean(valor.activo)
      })
      .subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'ok_provider_create';
          this.formularioProveedor.reset({
            nombre: '',
            contacto: '',
            categoria: '',
            activo: true
          });
          this.cargarProveedores();
        },
        error: () => {
          this.guardando = false;
          this.mensajeError = 'err_provider_create';
        }
      });
  }

  eliminarProveedor(idProveedor: number): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.proveedoresApiService.eliminarProveedor(idProveedor).subscribe({
      next: () => {
        this.mensajeExito = 'ok_provider_delete';
        this.cargarProveedores();
      },
      error: () => {
        this.mensajeError = 'err_provider_delete';
      }
    });
  }
}
