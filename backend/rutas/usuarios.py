from fastapi import APIRouter, Depends, HTTPException

from backend.dependencias import ROL_ADMIN, requerir_rol
from backend.esquemas import EmpleadoActualizar, EmpleadoCrear
from backend.supabase_cliente import cliente_supabase

enrutador_usuarios = APIRouter(prefix="/usuarios", tags=["usuarios"])


@enrutador_usuarios.get("")
def listar_usuarios(_: str = Depends(requerir_rol(ROL_ADMIN))) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("empleados").select("*").order("id").execute()
        return respuesta.data or []
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al listar usuarios: {error}") from error


@enrutador_usuarios.post("")
def crear_usuario(usuario: EmpleadoCrear, _: str = Depends(requerir_rol(ROL_ADMIN))) -> dict:
    try:
        respuesta = cliente_supabase.table("empleados").insert(usuario.model_dump()).execute()
        return (respuesta.data or [{}])[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear usuario: {error}") from error


@enrutador_usuarios.put("/{id_usuario}")
def actualizar_usuario(
    id_usuario: int,
    usuario: EmpleadoActualizar,
    _: str = Depends(requerir_rol(ROL_ADMIN)),
) -> dict:
    try:
        datos_actualizacion = {k: v for k, v in usuario.model_dump().items() if v is not None}
        if not datos_actualizacion:
            raise HTTPException(status_code=400, detail="No se enviaron campos para actualizar")

        respuesta = (
            cliente_supabase.table("empleados")
            .update(datos_actualizacion)
            .eq("id", id_usuario)
            .execute()
        )
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return respuesta.data[0]
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al actualizar usuario: {error}") from error


@enrutador_usuarios.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: int, _: str = Depends(requerir_rol(ROL_ADMIN))) -> dict:
    try:
        respuesta = cliente_supabase.table("empleados").delete().eq("id", id_usuario).execute()
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return {"mensaje": "Usuario eliminado correctamente", "id_usuario": id_usuario}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {error}") from error
