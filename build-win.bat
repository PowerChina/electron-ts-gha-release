@echo off
setlocal

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js not found. Please install Node.js 20+ first.
  exit /b 1
)

if not exist node_modules (
  echo [INFO] Installing dependencies...
  call npm ci
  if %errorlevel% neq 0 exit /b %errorlevel%
)

echo [INFO] Building Windows installer (.exe)...
call npm run dist -- --win nsis
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [OK] Done. Check the release\ folder for .exe output.
dir /b release\*.exe

endlocal
