from fastapi import APIRouter, HTTPException
from fastapi import Depends

from backend.dependencias import ROL_ADMIN, ROL_EMPLEADO, requerir_rol
from backend.esquemas import VentaCrear
from backend.supabase_cliente import cliente_supabase

enrutador_ventas = APIRouter(prefix="/ventas", tags=["ventas"])


@enrutador_ventas.get("")
def listar_ventas(_: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("ventas").select("*").order("fecha", desc=True).execute()
        return respuesta.data or []
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al listar ventas: {error}") from error


@enrutador_ventas.post("")
def crear_venta(venta: VentaCrear, _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))) -> dict:
    try:
        datos_venta = venta.model_dump(mode="json")
        respuesta = cliente_supabase.table("ventas").insert(datos_venta).execute()
        return (respuesta.data or [{}])[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear venta: {error}") from error
