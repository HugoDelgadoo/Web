from datetime import date, timedelta

from fastapi import APIRouter, HTTPException
from fastapi import Depends

from backend.dependencias import ROL_ADMIN, ROL_EMPLEADO, requerir_rol
from backend.esquemas import ProductoActualizar, ProductoCrear
from backend.supabase_cliente import cliente_supabase

enrutador_productos = APIRouter(prefix="/productos", tags=["productos"])


@enrutador_productos.get("")
def listar_productos(_: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("productos").select("*").execute()
        return respuesta.data or []
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al listar productos: {error}") from error


@enrutador_productos.post("")
def crear_producto(
    producto: ProductoCrear, _: str = Depends(requerir_rol(ROL_ADMIN))
) -> dict:
    try:
        datos_producto = producto.model_dump()
        respuesta = cliente_supabase.table("productos").insert(datos_producto).execute()
        return (respuesta.data or [{}])[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear producto: {error}") from error


@enrutador_productos.put("/{id_producto}")
def actualizar_producto(
    id_producto: int,
    producto: ProductoActualizar,
    _: str = Depends(requerir_rol(ROL_ADMIN)),
) -> dict:
    try:
        campos_actualizar = {k: v for k, v in producto.model_dump().items() if v is not None}
        if not campos_actualizar:
            raise HTTPException(status_code=400, detail="No se enviaron campos para actualizar")

        respuesta = (
            cliente_supabase.table("productos")
            .update(campos_actualizar)
            .eq("id", id_producto)
            .execute()
        )
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return respuesta.data[0]
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al actualizar producto: {error}") from error


@enrutador_productos.delete("/{id_producto}")
def eliminar_producto(id_producto: int, _: str = Depends(requerir_rol(ROL_ADMIN))) -> dict:
    try:
        respuesta = cliente_supabase.table("productos").delete().eq("id", id_producto).execute()
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"mensaje": "Producto eliminado correctamente", "id_producto": id_producto}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al eliminar producto: {error}") from error


@enrutador_productos.get("/stock-bajo")
def listar_productos_stock_bajo(
    _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO)),
) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("productos").select("*").execute()
        productos = respuesta.data or []
        return [p for p in productos if int(p.get("stock", 0)) < int(p.get("stock_minimo", 0))]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al detectar stock bajo: {error}") from error


@enrutador_productos.get("/proximos-caducar")
def listar_productos_proximos_caducar(
    _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO)),
) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("productos").select("*").execute()
        productos = respuesta.data or []
        hoy = date.today()
        limite = hoy + timedelta(days=7)
        productos_filtrados = []

        for producto in productos:
            fecha_texto = producto.get("fecha_caducidad")
            if not fecha_texto:
                continue
            try:
                fecha_caducidad = date.fromisoformat(str(fecha_texto))
            except ValueError:
                continue
            if hoy <= fecha_caducidad <= limite:
                producto["dias_para_caducar"] = (fecha_caducidad - hoy).days
                productos_filtrados.append(producto)

        return sorted(productos_filtrados, key=lambda p: p["fecha_caducidad"])
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al filtrar caducidad: {error}") from error
