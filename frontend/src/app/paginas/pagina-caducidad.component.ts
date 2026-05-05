import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../modelos/producto';
import { ProductosApiService } from '../servicios/productos-api.service';

@Component({
  selector: 'app-pagina-caducidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-caducidad.component.html',
  styleUrl: './pagina-caducidad.component.css'
})
export class PaginaCaducidadComponent implements OnInit {
  productos: Producto[] = [];
  mensajeError = '';

  constructor(private readonly productosApiService: ProductosApiService) {}

  ngOnInit(): void {
    this.productosApiService.listarProximosCaducar().subscribe({
      next: (productos) => (this.productos = productos),
      error: () => (this.mensajeError = 'No se pudieron cargar los productos próximos a caducar.')
    });
  }
}
