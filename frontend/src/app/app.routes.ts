import { Routes } from '@angular/router';
import { guardaAutenticacion } from './guardas/autenticacion.guard';
import { guardaRol } from './guardas/rol.guard';
import { PaginaDashboardComponent } from './paginas/pagina-dashboard.component';
import { PaginaCaducidadComponent } from './paginas/pagina-caducidad.component';
import { PaginaComprasComponent } from './paginas/pagina-compras.component';
import { PaginaLoginComponent } from './paginas/pagina-login.component';
import { PaginaProductosComponent } from './paginas/pagina-productos.component';
import { PaginaProveedoresComponent } from './paginas/pagina-proveedores.component';
import { PaginaUsuariosComponent } from './paginas/pagina-usuarios.component';
import { PaginaVentasComponent } from './paginas/pagina-ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: PaginaLoginComponent },
  {
    path: 'dashboard',
    component: PaginaDashboardComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin'] }
  },
  {
    path: 'productos',
    component: PaginaProductosComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin', 'Empleado'] }
  },
  {
    path: 'ventas',
    component: PaginaVentasComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin', 'Empleado'] }
  },
  {
    path: 'usuarios',
    component: PaginaUsuariosComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin'] }
  },
  {
    path: 'proveedores',
    component: PaginaProveedoresComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin', 'Empleado'] }
  },
  {
    path: 'compras',
    component: PaginaComprasComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin'] }
  },
  {
    path: 'caducidad',
    component: PaginaCaducidadComponent,
    canActivate: [guardaAutenticacion, guardaRol],
    data: { roles: ['Admin', 'Empleado'] }
  },
  { path: '**', redirectTo: 'login' }
];
