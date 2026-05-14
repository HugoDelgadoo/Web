# 03. Requisitos Y Stack

## Requisitos de entorno
- Windows PowerShell (o shell equivalente)
- Python 3.13+
- Node.js + npm
- Proyecto Supabase activo

## Backend
- fastapi==0.115.0
- uvicorn[standard]==0.30.6
- supabase==2.7.4
- pydantic-settings==2.5.2

## Frontend
- Angular 21.2.x
- TypeScript 5.9.x
- RxJS 7.8.x
- chart.js + ng2-charts

## Variables de entorno backend
Archivo `backend/.env` con:
- `URL_SUPABASE=https://<tu-proyecto>.supabase.co`
- `CLAVE_SUPABASE=<service_role_o_clave_correspondiente>`
