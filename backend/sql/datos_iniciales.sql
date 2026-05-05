insert into public.productos (nombre, precio, stock)
values
('Leche Entera 1L', 1.15, 120),
('Pan de Molde', 1.85, 75),
('Arroz 1Kg', 1.30, 90)
on conflict do nothing;

insert into public.ventas (fecha, total)
values (now(), 3.45)
on conflict do nothing;

insert into public.detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
select v.id, p.id, 1, p.precio
from public.ventas v
cross join lateral (
    select id, precio
    from public.productos
    order by id asc
    limit 1
) p
order by v.id asc
limit 1;
