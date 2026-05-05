export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Empleado';
  activo: boolean;
}

export interface UsuarioCrear {
  nombre: string;
  email: string;
  rol: 'Admin' | 'Empleado';
  activo: boolean;
}
