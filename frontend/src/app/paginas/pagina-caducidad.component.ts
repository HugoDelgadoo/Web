import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../modelos/producto';
import { I18nPipe } from '../pipes/i18n.pipe';
import { ProductosApiService } from '../servicios/productos-api.service';

@Component({
  selector: 'app-pagina-caducidad',
  standalone: true,
  imports: [CommonModule, I18nPipe],
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
      error: () => (this.mensajeError = 'err_expiry_load')
    });
  }
}
