# 10. Estado Actual Y Riesgos

## Estado actual
- Repositorio subido a GitHub.
- Backend arrancable y validado por `/health`.
- Frontend arrancable en `localhost:4200`.
- Login corregido para apuntar al backend en puerto 8000.

## Riesgos conocidos
1. Seguridad de autenticacion mejorable (comparacion directa de `clave_acceso`).
2. Falta de tests automatizados end-to-end.
3. Dependencia de configuracion manual de Supabase en `.env`.
4. Sin pipeline CI/CD obligatorio en cada cambio.

## Checklist para continuidad (Claude)
1. Validar `.env` y conectividad Supabase.
2. Levantar backend y frontend.
3. Probar login y rutas principales.
4. Priorizar roadmap por impacto y riesgo.
5. Implementar mejoras en ramas pequenas y verificables.
