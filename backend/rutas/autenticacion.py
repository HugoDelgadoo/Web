from fastapi import APIRouter, HTTPException

from backend.esquemas import InicioSesionEntrada
from backend.supabase_cliente import cliente_supabase

enrutador_autenticacion = APIRouter(prefix="/auth", tags=["autenticacion"])


@enrutador_autenticacion.post("/login")
def iniciar_sesion(credenciales: InicioSesionEntrada) -> dict:
    try:
        respuesta = (
            cliente_supabase.table("empleados")
            .select("id,nombre,email,rol,activo,clave_acceso")
            .eq("email", credenciales.email.strip().lower())
            .limit(1)
            .execute()
        )
        if not respuesta.data:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        empleado = respuesta.data[0]
        if not empleado.get("activo", False):
            raise HTTPException(status_code=403, detail="Usuario inactivo")

        if (empleado.get("clave_acceso") or "") != credenciales.clave_acceso:
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
