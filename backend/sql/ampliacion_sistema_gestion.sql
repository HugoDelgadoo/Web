
-- 1) Productos: nuevos campos para stock minimo y caducidad
alter table if exists public.productos
    add column if not exists stock_minimo integer not null default 5 check (stock_minimo >= 0),
    add column if not exists fecha_caducidad date;

-- 2) Proveedores
create table if not exists public.proveedores (
    id bigserial primary key,
    nombre varchar(140) not null,
    contacto varchar(180) not null,
    categoria varchar(100) not null,
    activo boolean not null default true,
    creado_en timestamptz not null default now()
);

create index if not exists idx_proveedores_nombre on public.proveedores (nombre);
create index if not exists idx_proveedores_categoria on public.proveedores (categoria);

-- Relacion opcional producto -> proveedor principal
alter table if exists public.productos
    add column if not exists id_proveedor bigint references public.proveedores(id) on delete set null;

create index if not exists idx_productos_id_proveedor on public.productos (id_proveedor);

-- 3) Empleados y roles de aplicacion
create table if not exists public.empleados (
    id bigserial primary key,
    nombre varchar(120) not null,
    email varchar(160) not null unique,
    rol varchar(20) not null check (rol in ('Admin', 'Empleado')),
    activo boolean not null default true,
    creado_en timestamptz not null default now()
);

create index if not exists idx_empleados_rol on public.empleados (rol);

-- 4) Pedidos de compra (para generar lista de reposicion)
create table if not exists public.pedidos_compra (
    id bigserial primary key,
    fecha timestamptz not null default now(),
    estado varchar(20) not null default 'Borrador'
        check (estado in ('Borrador', 'Enviado', 'Recibido', 'Cancelado')),
    observaciones text,
    creado_en timestamptz not null default now()
);

create table if not exists public.detalle_pedido_compra (
    id bigserial primary key,
    id_pedido_compra bigint not null references public.pedidos_compra(id) on delete cascade,
    id_producto bigint not null references public.productos(id) on delete restrict,
    cantidad_sugerida integer not null check (cantidad_sugerida > 0),
    stock_actual integer not null check (stock_actual >= 0),
    stock_minimo integer not null check (stock_minimo >= 0),
    creado_en timestamptz not null default now()
);

create index if not exists idx_detalle_pedido_compra_pedido on public.detalle_pedido_compra (id_pedido_compra);
create index if not exists idx_detalle_pedido_compra_producto on public.detalle_pedido_compra (id_producto);
