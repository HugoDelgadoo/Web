# 07. Datos Y SQL

## Esquema base (`backend/sql/esquema_inicial.sql`)
- `productos`
- `ventas`
- `detalle_ventas`

## Ampliacion (`backend/sql/ampliacion_sistema_gestion.sql`)
- Campos extra de productos (`stock_minimo`, `fecha_caducidad`)
- `proveedores`
- Relacion `productos.id_proveedor`
- `empleados` con rol (`Admin`, `Empleado`)
- `pedidos_compra`
- `detalle_pedido_compra`

## Credenciales de ejemplo (`backend/sql/credenciales_empleados.sql`)
- Añade columna `clave_acceso` en `empleados`.
- Defaults:
  - Admin: `admin1234`
  - Empleado: `empleado1234`

## Nota de seguridad
Estas claves son para entorno local/demo. En produccion debe usarse hash de contrasena y politicas RLS estrictas.
