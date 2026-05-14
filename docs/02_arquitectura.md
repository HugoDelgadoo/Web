# 02. Arquitectura

## Vista general
- Frontend Angular consume API REST de FastAPI.
- Backend FastAPI accede a Supabase mediante cliente Python.
- Supabase almacena datos de inventario, ventas, empleados y compras.

## Flujo principal
1. Usuario inicia sesion en frontend.
2. Frontend llama `POST /auth/login`.
3. Backend valida contra tabla `empleados`.
4. Frontend guarda sesion en `localStorage`.
5. Vistas protegidas consumen modulos (productos, ventas, etc.).

## Capas
- Presentacion: componentes y paginas Angular.
- Aplicacion: servicios frontend + rutas FastAPI.
- Datos: tablas Postgres gestionadas en Supabase.
