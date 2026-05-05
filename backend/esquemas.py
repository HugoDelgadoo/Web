from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ProductoBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=120)
    precio: float = Field(gt=0)
    stock: int = Field(ge=0)
    stock_minimo: int = Field(ge=0, default=5)
    fecha_caducidad: Optional[date] = None
    id_proveedor: Optional[int] = None


class ProductoCrear(ProductoBase):
    pass


class ProductoActualizar(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    precio: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)
    stock_minimo: Optional[int] = Field(default=None, ge=0)
    fecha_caducidad: Optional[date] = None
    id_proveedor: Optional[int] = Field(default=None, gt=0)


class ProductoRespuesta(ProductoBase):
    id: int


class VentaBase(BaseModel):
    fecha: datetime
    total: float = Field(ge=0)


class VentaCrear(VentaBase):
    pass


class VentaRespuesta(VentaBase):
    id: int


class DetalleVentaBase(BaseModel):
    id_venta: int = Field(gt=0)
    id_producto: int = Field(gt=0)
    cantidad: int = Field(gt=0)
    precio_unitario: float = Field(gt=0)

    @field_validator("cantidad")
    @classmethod
    def validar_cantidad(cls, valor: int) -> int:
        if valor <= 0:
            raise ValueError("La cantidad debe ser mayor que cero")
        return valor


class DetalleVentaCrear(DetalleVentaBase):
    pass


class DetalleVentaRespuesta(DetalleVentaBase):
    id: int


class EmpleadoBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=6, max_length=160)
    rol: str = Field(pattern="^(Admin|Empleado)$")
    activo: bool = True


class EmpleadoCrear(EmpleadoBase):
    pass


class EmpleadoActualizar(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=120)
    email: Optional[str] = Field(default=None, min_length=6, max_length=160)
    rol: Optional[str] = Field(default=None, pattern="^(Admin|Empleado)$")
    activo: Optional[bool] = None


class ProveedorBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=140)
    contacto: str = Field(min_length=4, max_length=180)
    categoria: str = Field(min_length=2, max_length=100)
    activo: bool = True


class ProveedorCrear(ProveedorBase):
    pass


class ProveedorActualizar(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=140)
    contacto: Optional[str] = Field(default=None, min_length=4, max_length=180)
    categoria: Optional[str] = Field(default=None, min_length=2, max_length=100)
    activo: Optional[bool] = None


class InicioSesionEntrada(BaseModel):
    email: str = Field(min_length=6, max_length=160)
    clave_acceso: str = Field(min_length=4, max_length=120)


class InicioSesionRespuesta(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str
