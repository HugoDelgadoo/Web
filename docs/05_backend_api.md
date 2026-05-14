# 05. Backend API

## Entry point
- `backend/main.py`

## Endpoints/rutas principales
- `/auth` autenticacion
- `/productos`
- `/ventas`
- `/detalle-ventas`
- `/dashboard`
- `/usuarios`
- `/proveedores`
- `/compras`
- `/health`

## Aspectos de implementacion
- CORS habilitado para `http://localhost:4200` y `http://127.0.0.1:4200`.
- Cliente Supabase centralizado en `backend/supabase_cliente.py`.
- Configuracion central en `backend/configuracion.py`.

## Cambio clave ya aplicado
`configuracion.py` carga `.env` por ruta absoluta del propio backend, evitando fallos por directorio de arranque.
