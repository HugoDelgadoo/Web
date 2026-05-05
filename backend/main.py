from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.rutas.productos import enrutador_productos
from backend.rutas.ventas import enrutador_ventas
from backend.rutas.detalle_ventas import enrutador_detalle_ventas
from backend.rutas.dashboard import enrutador_dashboard
from backend.rutas.usuarios import enrutador_usuarios
from backend.rutas.proveedores import enrutador_proveedores
from backend.rutas.compras import enrutador_compras
from backend.rutas.autenticacion import enrutador_autenticacion


def crear_aplicacion() -> FastAPI:
    aplicacion = FastAPI(
        title="API Gestoria Inventario y Ventas",
        version="0.1.0",
        description="Backend del TFG con FastAPI y Supabase",
    )

    # Solo se permite el frontend local de Angular por seguridad.
    aplicacion.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    aplicacion.include_router(enrutador_productos)
    aplicacion.include_router(enrutador_ventas)
    aplicacion.include_router(enrutador_detalle_ventas)
    aplicacion.include_router(enrutador_dashboard)
    aplicacion.include_router(enrutador_usuarios)
    aplicacion.include_router(enrutador_proveedores)
    aplicacion.include_router(enrutador_compras)
    aplicacion.include_router(enrutador_autenticacion)

    @aplicacion.get("/health", tags=["salud"])
    def verificar_salud() -> dict:
        return {"estado": "ok"}

    return aplicacion


app = crear_aplicacion()
