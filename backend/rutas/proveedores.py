from fastapi import APIRouter, Depends, HTTPException

from backend.dependencias import ROL_ADMIN, ROL_EMPLEADO, requerir_rol
from backend.esquemas import ProveedorActualizar, ProveedorCrear
from backend.supabase_cliente import cliente_supabase

enrutador_proveedores = APIRouter(prefix="/proveedores", tags=["proveedores"])


@enrutador_proveedores.get("")
def listar_proveedores(_: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("proveedores").select("*").order("id").execute()
        return respuesta.data or []
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al listar proveedores: {error}") from error


@enrutador_proveedores.post("")
def crear_proveedor(
    proveedor: ProveedorCrear, _: str = Depends(requerir_rol(ROL_ADMIN))
) -> dict:
    try:
        respuesta = cliente_supabase.table("proveedores").insert(proveedor.model_dump()).execute()
        return (respuesta.data or [{}])[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear proveedor: {error}") from error


@enrutador_proveedores.put("/{id_proveedor}")
def actualizar_proveedor(
    id_proveedor: int,
    proveedor: ProveedorActualizar,
    _: str = Depends(requerir_rol(ROL_ADMIN)),
) -> dict:
    try:
        datos_actualizacion = {k: v for k, v in proveedor.model_dump().items() if v is not None}
        if not datos_actualizacion:
            raise HTTPException(status_code=400, detail="No se enviaron campos para actualizar")

        respuesta = (
            cliente_supabase.table("proveedores")
            .update(datos_actualizacion)
            .eq("id", id_proveedor)
            .execute()
        )
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        return respuesta.data[0]
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al actualizar proveedor: {error}") from error
