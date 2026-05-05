create table if not exists public.productos (
    id bigserial primary key,
    nombre varchar(120) not null,
    precio numeric(10,2) not null check (precio > 0),
    stock integer not null default 0 check (stock >= 0),
    creado_en timestamptz not null default now(),
    actualizado_en timestamptz not null default now()
);

create table if not exists public.ventas (
    id bigserial primary key,
    fecha timestamptz not null default now(),
    total numeric(12,2) not null default 0 check (total >= 0),
    creado_en timestamptz not null default now()
);

create table if not exists public.detalle_ventas (
    id bigserial primary key,
    id_venta bigint not null references public.ventas(id) on delete cascade,
    id_producto bigint not null references public.productos(id) on delete restrict,
    cantidad integer not null check (cantidad > 0),
    precio_unitario numeric(10,2) not null check (precio_unitario > 0),
    subtotal numeric(12,2) generated always as (cantidad * precio_unitario) stored,
    creado_en timestamptz not null default now()
);

create index if not exists idx_productos_nombre on public.productos (nombre);
create index if not exists idx_detalle_ventas_id_venta on public.detalle_ventas (id_venta);
create index if not exists idx_detalle_ventas_id_producto on public.detalle_ventas (id_producto);
create index if not exists idx_ventas_fecha on public.ventas (fecha desc);

create or replace function public.actualizar_campo_actualizado_en()
returns trigger
language plpgsql
as $$
begin
    new.actualizado_en = now();
    return new;
end;
$$;

drop trigger if exists trigger_productos_actualizado_en on public.productos;
create trigger trigger_productos_actualizado_en
before update on public.productos
for each row
execute function public.actualizar_campo_actualizado_en();
