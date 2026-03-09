# Silent LLM Council Stopper
$llmPath = "C:\Users\abbsi\llm-council"

# Stop Backend (port 8000)
$backend = netstat -ano | findstr ":8000" | findstr "LISTENING"
if ($backend) {
    $pid8000 = ($backend -split '\s+')[-1]
    taskkill /F /PID $pid8000 2>$null
    Write-Host "Backend stopped!"
}

# Stop Frontend (port 5173)
$frontend = netstat -ano | findstr ":5173" | findstr "LISTENING"
if ($frontend) {
    $pid5173 = ($frontend -split '\s+')[-1]
    taskkill /F /PID $pid5173 2>$null
    Write-Host "Frontend stopped!"
}

Write-Host "LLM Council stopped successfully!"
