import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../modelos/producto';
import { ProductosApiService } from '../servicios/productos-api.service';

@Component({
  selector: 'app-pagina-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagina-productos.component.html',
  styleUrl: './pagina-productos.component.css'
})
export class PaginaProductosComponent implements OnInit {
  productos: Producto[] = [];
  mensajeError = '';
  mensajeExito = '';

  formularioProducto!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productosApiService: ProductosApiService
  ) {
    this.formularioProducto = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get cantidadProductos(): number {
    return this.productos.length;
  }

  get stockTotal(): number {
    return this.productos.reduce((acumulado, producto) => acumulado + Number(producto.stock), 0);
  }

  get valorInventario(): number {
    return this.productos.reduce(
      (acumulado, producto) => acumulado + Number(producto.precio) * Number(producto.stock),
      0
    );
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosApiService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.mensajeError = '';
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar los productos.';
      }
    });
  }

  crearProducto(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const valores = this.formularioProducto.getRawValue();
    this.productosApiService
      .crearProducto({
        nombre: valores.nombre ?? '',
        precio: Number(valores.precio),
        stock: Number(valores.stock)
      })
      .subscribe({
        next: () => {
          this.mensajeExito = 'Producto creado correctamente.';
          this.formularioProducto.reset({ nombre: '', precio: 0, stock: 0 });
          this.cargarProductos();
        },
        error: () => {
          this.mensajeError = 'No se pudo crear el producto.';
        }
      });
  }
}
