from typing import Callable

from fastapi import Header, HTTPException


ROL_ADMIN = "Admin"
ROL_EMPLEADO = "Empleado"
ROLES_VALIDOS = {ROL_ADMIN, ROL_EMPLEADO}


def requerir_rol(*roles_permitidos: str) -> Callable:
    def validador_rol(x_rol: str = Header(default=ROL_EMPLEADO, alias="X-Rol")) -> str:
        if x_rol not in ROLES_VALIDOS:
            raise HTTPException(status_code=401, detail="Rol no valido. Usa 'Admin' o 'Empleado'.")
        if x_rol not in roles_permitidos:
            raise HTTPException(status_code=403, detail="No tienes permisos para esta accion.")
        return x_rol

    return validador_rol
