# 06. Frontend Funcional

## Estructura
- Angular standalone components
- Paginas en `frontend/src/app/paginas`
- Servicios API en `frontend/src/app/servicios`
- Guardas en `frontend/src/app/guardas`

## Modulos funcionales visibles
- Login
- Dashboard
- Productos
- Ventas
- Compras
- Proveedores
- Usuarios
- Caducidad

## Sesion
- Se guarda en `localStorage` (clave `sesion_usuario`).
- Navegacion segun rol (`Admin` o `Empleado`).

## Cambio clave ya aplicado
- `frontend/src/environments/environment.ts` usa `urlApi: 'http://127.0.0.1:8000'`.
- Se anadio timeout de 10s en servicio de autenticacion para evitar cargas indefinidas.
