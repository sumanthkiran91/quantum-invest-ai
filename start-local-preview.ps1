$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$nodeDir = "C:\Users\r\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$node = Join-Path $nodeDir "node.exe"
$env:PATH = "$nodeDir;$env:PATH"

if (-not (Test-Path $node)) {
  Write-Host "Could not find the bundled Node.js runtime. Install Node.js, then run: npm run dev"
  Read-Host "Press Enter to exit"
  exit 1
}

if (-not (Test-Path ".next\BUILD_ID")) {
  Write-Host "Building Quantum Invest AI first..."
  & $node work\pnpm\package\bin\pnpm.cjs build
}

Write-Host ""
Write-Host "Quantum Invest AI local preview is starting..."
Write-Host "Open this URL in your browser: http://127.0.0.1:3000"
Write-Host "Keep this window open while reviewing the prototype. Press Ctrl+C to stop."
Write-Host ""
& $node node_modules\next\dist\bin\next start -p 3000 -H 127.0.0.1
Read-Host "Press Enter to exit"
