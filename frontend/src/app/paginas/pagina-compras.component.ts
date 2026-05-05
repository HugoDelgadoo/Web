import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemListaPedido } from '../modelos/compra';
import { ComprasApiService } from '../servicios/compras-api.service';
import { RolService } from '../servicios/rol.service';

@Component({
  selector: 'app-pagina-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagina-compras.component.html',
  styleUrl: './pagina-compras.component.css'
})
export class PaginaComprasComponent implements OnInit {
  listaPedido: ItemListaPedido[] = [];
  mensaje = '';
  mensajeError = '';

  constructor(
    private readonly comprasApiService: ComprasApiService,
    private readonly rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarListaPedido();
    this.rolService.rolActual$.subscribe(() => this.cargarListaPedido());
  }

  cargarListaPedido(): void {
    this.comprasApiService.obtenerListaPedido().subscribe({
      next: (lista) => {
        this.listaPedido = lista;
        this.mensajeError = '';
      },
      error: () => (this.mensajeError = 'No se pudo cargar la lista de pedido (requiere rol Admin).')
    });
  }

  generarPedido(): void {
    this.comprasApiService.generarPedido('Pedido generado desde frontend').subscribe({
      next: (respuesta) => {
        this.mensaje = respuesta.mensaje;
        this.cargarListaPedido();
      },
      error: () => (this.mensajeError = 'No se pudo generar el pedido de compra.')
    });
  }
}
