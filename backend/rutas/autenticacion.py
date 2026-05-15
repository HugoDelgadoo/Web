from fastapi import APIRouter, HTTPException

from backend.esquemas import InicioSesionEntrada
from backend.supabase_cliente import cliente_supabase

enrutador_autenticacion = APIRouter(prefix="/auth", tags=["autenticacion"])


def _es_clave_valida(clave_guardada: str, clave_introducida: str) -> bool:
    if clave_guardada == clave_introducida:
        return True

    # Compatibilidad con el acceso antiguo usado en demos locales.
    if clave_introducida == "1234" and clave_guardada in {"admin1234", "empleado1234"}:
        return True

    return False


@enrutador_autenticacion.post("/login")
def iniciar_sesion(credenciales: InicioSesionEntrada) -> dict:
    try:
        identificador = credenciales.email.strip()

        # Permitimos entrar con email o con nombre de usuario.
        respuesta = (
            cliente_supabase.table("empleados")
            .select("id,nombre,email,rol,activo,clave_acceso")
            .eq("email", identificador.lower())
            .limit(1)
            .execute()
        )
        if not respuesta.data:
            respuesta = (
                cliente_supabase.table("empleados")
                .select("id,nombre,email,rol,activo,clave_acceso")
                .ilike("nombre", identificador)
                .limit(1)
                .execute()
            )
        if not respuesta.data:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        empleado = respuesta.data[0]
        if not empleado.get("activo", False):
            raise HTTPException(status_code=403, detail="Usuario inactivo")

        if not _es_clave_valida((empleado.get("clave_acceso") or ""), credenciales.clave_acceso):
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        return {
            "id": empleado["id"],
            "nombre": empleado["nombre"],
            "email": empleado["email"],
            "rol": empleado["rol"],
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en inicio de sesion: {error}") from error
