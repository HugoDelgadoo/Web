import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Venta } from '../modelos/venta';
import { I18nPipe } from '../pipes/i18n.pipe';
import { VentasApiService } from '../servicios/ventas-api.service';

@Component({
  selector: 'app-pagina-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, I18nPipe],
  templateUrl: './pagina-ventas.component.html',
  styleUrl: './pagina-ventas.component.css'
})
export class PaginaVentasComponent implements OnInit {
  ventas: Venta[] = [];
  mensajeError = '';
  mensajeExito = '';

  formularioVenta!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ventasApiService: VentasApiService
  ) {
    this.formularioVenta = this.formBuilder.group({
      fecha: [new Date().toISOString().slice(0, 16), [Validators.required]],
      total: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get cantidadVentas(): number {
    return this.ventas.length;
  }

  get totalAcumulado(): number {
    return this.ventas.reduce((acumulado, venta) => acumulado + Number(venta.total), 0);
  }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventasApiService.listarVentas().subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.mensajeError = '';
      },
      error: () => {
        this.mensajeError = 'err_sales_load';
      }
    });
  }

  crearVenta(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    if (this.formularioVenta.invalid) {
      this.formularioVenta.markAllAsTouched();
      return;
    }

    const valores = this.formularioVenta.getRawValue();
    this.ventasApiService
      .crearVenta({
        fecha: new Date(valores.fecha ?? '').toISOString(),
        total: Number(valores.total)
      })
      .subscribe({
        next: () => {
          this.mensajeExito = 'ok_sale_create';
          this.cargarVentas();
        },
        error: () => {
          this.mensajeError = 'err_sale_create';
        }
      });
  }

  eliminarVenta(idVenta: number): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.ventasApiService.eliminarVenta(idVenta).subscribe({
      next: () => {
        this.mensajeExito = 'ok_sale_delete';
        this.cargarVentas();
      },
      error: () => {
        this.mensajeError = 'err_sale_delete';
      }
    });
  }
}
