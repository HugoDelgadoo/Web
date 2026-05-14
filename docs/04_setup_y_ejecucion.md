# 04. Setup Y Ejecucion

## 1) Backend
```powershell
cd "C:\Users\User\Documents\New project\backend"
python -m pip install -r requirements.txt
cd "C:\Users\User\Documents\New project"
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:
- `http://127.0.0.1:8000/health`

## 2) Frontend
```powershell
cd "C:\Users\User\Documents\New project\frontend"
npm.cmd install
npm.cmd start
```

Frontend:
- `http://localhost:4200`

## 3) Problema frecuente en PowerShell con npm
Si aparece bloqueo por ExecutionPolicy:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```
O usar siempre `npm.cmd`.
