alter table if exists public.empleados
    add column if not exists clave_acceso varchar(120);

update public.empleados
set clave_acceso = case
    when rol = 'Admin' then 'admin1234'
    else 'empleado1234'
end
where clave_acceso is null or clave_acceso = '';
