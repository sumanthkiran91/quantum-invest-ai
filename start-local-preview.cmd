@echo off
setlocal
cd /d "%~dp0"
set "NODE_DIR=C:\Users\r\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "NODE=%NODE_DIR%\node.exe"
set "PATH=%NODE_DIR%;%PATH%"

if not exist "%NODE%" (
  echo Could not find the bundled Node.js runtime.
  echo Install Node.js, then run: npm run dev
  pause
  exit /b 1
)

if not exist ".next\BUILD_ID" (
  echo Building Quantum Invest AI first...
  "%NODE%" work\pnpm\package\bin\pnpm.cjs build
  if errorlevel 1 (
    echo Build failed. Please check the messages above.
    pause
    exit /b 1
  )
)

echo.
echo Quantum Invest AI local preview is starting...
echo Open this URL in your browser:
echo http://127.0.0.1:3000
echo.
echo Keep this window open while reviewing the prototype.
echo Press Ctrl+C to stop the server.
echo.
"%NODE%" node_modules\next\dist\bin\next start -p 3000 -H 127.0.0.1
pause
