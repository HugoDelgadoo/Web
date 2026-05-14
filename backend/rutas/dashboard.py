from datetime import date, datetime, timedelta
import math

from fastapi import APIRouter, Depends, HTTPException

from backend.dependencias import ROL_ADMIN, ROL_EMPLEADO, requerir_rol
from backend.supabase_cliente import cliente_supabase

enrutador_dashboard = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _a_float_seguro(valor: object, por_defecto: float = 0.0) -> float:
    try:
        numero = float(valor)
        if math.isnan(numero) or math.isinf(numero):
            return por_defecto
        return numero
    except (TypeError, ValueError):
        return por_defecto


@enrutador_dashboard.get("/resumen")
def obtener_resumen_dashboard(
    _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO)),
) -> dict:
    try:
        hoy_iso = date.today().isoformat()
        respuesta_ventas = cliente_supabase.table("ventas").select("id,fecha,total").execute()
        respuesta_productos = cliente_supabase.table("productos").select("id,stock,stock_minimo").execute()

        ventas = respuesta_ventas.data or []
        productos = respuesta_productos.data or []

        ventas_hoy = sum(
            _a_float_seguro(venta.get("total", 0))
            for venta in ventas
            if str(venta.get("fecha", "")).startswith(hoy_iso)
        )
        total_acumulado = sum(_a_float_seguro(venta.get("total", 0)) for venta in ventas)
        alertas_stock_bajo = sum(
            1
            for producto in productos
            if int(producto.get("stock", 0)) < int(producto.get("stock_minimo", 0))
        )

        return {
            "ventas_del_dia": round(ventas_hoy, 2),
            "total_acumulado": round(total_acumulado, 2),
            "alertas_stock_bajo": alertas_stock_bajo,
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener dashboard: {error}") from error


@enrutador_dashboard.get("/tendencia-ventas")
def obtener_tendencia_ventas(
    dias: int = 14, _: str = Depends(requerir_rol(ROL_ADMIN, ROL_EMPLEADO))
) -> list[dict]:
    try:
        dias = max(1, min(dias, 60))
        respuesta = cliente_supabase.table("ventas").select("fecha,total").execute()
        ventas = respuesta.data or []

        hoy = date.today()
        fecha_inicio = hoy - timedelta(days=dias - 1)
        acumulado_por_dia: dict[str, float] = {
            (fecha_inicio + timedelta(days=i)).isoformat(): 0.0 for i in range(dias)
        }

        for venta in ventas:
            fecha_texto = str(venta.get("fecha", ""))
            try:
                fecha = datetime.fromisoformat(fecha_texto.replace("Z", "+00:00")).date()
            except ValueError:
                continue
            if fecha < fecha_inicio or fecha > hoy:
                continue
            clave = fecha.isoformat()
            acumulado_por_dia[clave] = acumulado_por_dia.get(clave, 0.0) + _a_float_seguro(
                venta.get("total", 0)
            )

        return [{"fecha": f, "total": round(t, 2)} for f, t in acumulado_por_dia.items()]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al obtener tendencia: {error}") from error
