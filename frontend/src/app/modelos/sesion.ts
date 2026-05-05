import { RolAplicacion } from '../servicios/rol.service';

export interface CredencialesInicioSesion {
  email: string;
  clave_acceso: string;
}

export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  rol: RolAplicacion;
}
