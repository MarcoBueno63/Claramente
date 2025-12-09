# Script de Restauração da Versão Estável
# Execute este script no PowerShell a partir do diretório raiz do projeto

# Parar servidor atual
taskkill /F /IM node.exe 2>$null

# Restaurar arquivos principais
Copy-Item "backups\stable-2025-11-11_00-50-31\ChatWindow.tsx" "components\ChatWindow.tsx" -Force
Copy-Item "backups\stable-2025-11-11_00-50-31\chat-page.tsx" "app\chat\page.tsx" -Force
Copy-Item "backups\stable-2025-11-11_00-50-31\onboarding-page.tsx" "app\onboarding\page.tsx" -Force
Copy-Item "backups\stable-2025-11-11_00-50-31\globals.css" "app\globals.css" -Force
Copy-Item "backups\stable-2025-11-11_00-50-31\api-chat-route.ts" "app\api\chat\route.ts" -Force

Write-Output "✅ Arquivos restaurados com sucesso!"
Write-Output "⚡ Inicie o servidor com: npm run dev"
Write-Output "🌐 Acesse: http://localhost:3000/chat"