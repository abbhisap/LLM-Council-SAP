# LLM Council - Silent Auto Starter FINAL
$llmPath = "C:\Users\abbsi\llm-council"
$frontendPath = "C:\Users\abbsi\llm-council\frontend"
$logFile = "$llmPath\startup.log"

"$(Get-Date) - Starting LLM Council..." | Out-File $logFile -Force

# Kill any existing instances first
"$(Get-Date) - Killing old instances..." | Add-Content $logFile
taskkill /F /IM python.exe 2>$null
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 3

# Start Backend
"$(Get-Date) - Starting Backend on port 8000..." | Add-Content $logFile
$backend = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c cd /d $llmPath && python -m uv run python -m backend.main >> $llmPath\backend.log 2>&1" `
    -WorkingDirectory $llmPath `
    -WindowStyle Hidden `
    -PassThru
"$(Get-Date) - Backend PID: $($backend.Id)" | Add-Content $logFile

# Wait for backend to fully start
"$(Get-Date) - Waiting for backend..." | Add-Content $logFile
Start-Sleep -Seconds 15

# Verify backend started
$port8000 = netstat -ano | findstr ":8000" | findstr "LISTENING"
if ($port8000) {
    "$(Get-Date) - Backend confirmed on port 8000!" | Add-Content $logFile
} else {
    "$(Get-Date) - WARNING: Backend may not have started!" | Add-Content $logFile
}

# Start Frontend
"$(Get-Date) - Starting Frontend on port 5173..." | Add-Content $logFile
$frontend = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c cd /d $frontendPath && npm run dev >> $llmPath\frontend.log 2>&1" `
    -WorkingDirectory $frontendPath `
    -WindowStyle Hidden `
    -PassThru
"$(Get-Date) - Frontend PID: $($frontend.Id)" | Add-Content $logFile

