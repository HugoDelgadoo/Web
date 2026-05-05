from supabase import Client, create_client

from backend.configuracion import configuracion


def crear_cliente_supabase() -> Client:
    return create_client(configuracion.url_supabase, configuracion.clave_supabase)


cliente_supabase = crear_cliente_supabase()
