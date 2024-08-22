@echo off
start "" python "./snapshot.py"

set SourceDir=%~dp0
set TempDir=%Temp%\ThePowderToyWeb

if exist "%TempDir%" rd /s /q "%TempDir%"
git clone https://github.com/kayyraa/ThePowderToyWeb.git "%TempDir%"

xcopy /s /e /y "%SourceDir%\*" "%TempDir%"
cd "%TempDir%"
git add .
git commit -m "Auto-update from local project folder"
git push origin main

cd ..
timeout /t 5 /nobreak >nul
rd /s /q "%TempDir%"