from fastapi import APIRouter, Depends, HTTPException

from backend.dependencias import ROL_ADMIN, requerir_rol
from backend.supabase_cliente import cliente_supabase

enrutador_compras = APIRouter(prefix="/compras", tags=["compras"])


def _calcular_lista_pedido(productos: list[dict]) -> list[dict]:
    lista_pedido: list[dict] = []
    for producto in productos:
        stock_actual = int(producto.get("stock", 0))
        stock_minimo = int(producto.get("stock_minimo", 0))
        if stock_actual >= stock_minimo:
            continue
        cantidad_sugerida = max(stock_minimo * 2 - stock_actual, 1)
        lista_pedido.append(
            {
                "id_producto": producto["id"],
                "nombre_producto": producto["nombre"],
                "stock_actual": stock_actual,
                "stock_minimo": stock_minimo,
                "cantidad_sugerida": cantidad_sugerida,
                "id_proveedor": producto.get("id_proveedor"),
            }
        )
    return lista_pedido


@enrutador_compras.get("/lista-pedido")
def obtener_lista_pedido(_: str = Depends(requerir_rol(ROL_ADMIN))) -> list[dict]:
    try:
        respuesta = cliente_supabase.table("productos").select("*").execute()
        productos = respuesta.data or []
        return _calcular_lista_pedido(productos)
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al generar lista de pedido: {error}") from error


@enrutador_compras.post("/generar-pedido")
def generar_pedido_compra(
    observaciones: str | None = None,
    _: str = Depends(requerir_rol(ROL_ADMIN)),
) -> dict:
    try:
        respuesta_productos = cliente_supabase.table("productos").select("*").execute()
        productos = respuesta_productos.data or []
        lista_pedido = _calcular_lista_pedido(productos)
        if not lista_pedido:
            return {"mensaje": "No hay productos con stock bajo", "id_pedido_compra": None, "detalles": []}

        pedido = (
            cliente_supabase.table("pedidos_compra")
            .insert({"estado": "Borrador", "observaciones": observaciones})
            .execute()
        )
        id_pedido_compra = pedido.data[0]["id"]

        detalles = [
            {
                "id_pedido_compra": id_pedido_compra,
                "id_producto": item["id_producto"],
                "cantidad_sugerida": item["cantidad_sugerida"],
                "stock_actual": item["stock_actual"],
                "stock_minimo": item["stock_minimo"],
            }
            for item in lista_pedido
        ]
        cliente_supabase.table("detalle_pedido_compra").insert(detalles).execute()

        return {
            "mensaje": "Pedido de compra generado correctamente",
            "id_pedido_compra": id_pedido_compra,
            "detalles": detalles,
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al crear pedido de compra: {error}") from error
