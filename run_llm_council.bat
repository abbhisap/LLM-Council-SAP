@echo off
title LLM Council Launcher

REM Exact verified paths
set PYTHON=C:\Python314\python.exe
set NPM=C:\Program Files\nodejs\npm.cmd
set LLM_PATH=C:\Users\abbsi\llm-council
set FRONTEND_PATH=C:\Users\abbsi\llm-council\frontend

echo ========================================
echo    Killing old instances...
echo ========================================
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo ========================================
echo    Starting Backend...
echo ========================================
start "LLM Backend" cmd /k "cd /d %LLM_PATH% && C:\Python314\python.exe -m uv run python -m backend.main"

echo Waiting 20 seconds for backend...
timeout /t 20 /nobreak >nul

echo ========================================
echo    Starting Frontend...
echo ========================================
start "LLM Frontend" cmd /k "cd /d %FRONTEND_PATH% && "C:\Program Files\nodejs\npm.cmd" run dev"

echo Waiting 15 seconds for frontend...
timeout /t 15 /nobreak >nul

echo ========================================
echo    Opening Browser...
echo ========================================
start "" "http://localhost:5173"

echo Done!
timeout /t 3 /nobreak >nul
exit
