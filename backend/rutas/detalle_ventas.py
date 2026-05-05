from fastapi import APIRouter, HTTPException
from fastapi import Depends

from backend.dependencias import ROL_ADMIN, ROL_EMPLEADO, requerir_rol
from backend.esquemas import DetalleVentaCrear
from backend.supabase_cliente import cliente_supabase

enrutador_detalle_ventas = APIRouter(prefix="/detalle-ventas", tags=["detalle_ventas"])


@enrutador_detalle_ventas.get("")
def listar_detalles_venta(_: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))) -> list[dict]:
    try:
        respuesta = (
            cliente_supabase.table("detalle_ventas")
            .select("id,id_venta,id_producto,cantidad,precio_unitario")
            .execute()
        )
        return respuesta.data or []
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Error al listar detalle de ventas: {error}"
        ) from error


@enrutador_detalle_ventas.post("")
def crear_detalle_venta(
    detalle_venta: DetalleVentaCrear, _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))
) -> dict:
    try:
        datos_detalle = detalle_venta.model_dump()
        respuesta = cliente_supabase.table("detalle_ventas").insert(datos_detalle).execute()
        return (respuesta.data or [{}])[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear detalle de venta: {error}") from error
