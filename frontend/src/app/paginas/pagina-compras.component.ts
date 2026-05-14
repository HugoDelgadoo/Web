import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemListaPedido } from '../modelos/compra';
import { I18nPipe } from '../pipes/i18n.pipe';
import { ComprasApiService } from '../servicios/compras-api.service';
import { RolService } from '../servicios/rol.service';

@Component({
  selector: 'app-pagina-compras',
  standalone: true,
  imports: [CommonModule, I18nPipe],
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
      error: () => (this.mensajeError = 'err_purchase_list')
    });
  }

  generarPedido(): void {
    this.comprasApiService.generarPedido('Pedido generado desde frontend').subscribe({
      next: (respuesta) => {
        this.mensaje = 'ok_purchase_create';
        this.cargarListaPedido();
      },
      error: () => (this.mensajeError = 'err_purchase_create')
    });
  }
}
