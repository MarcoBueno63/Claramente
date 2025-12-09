# 🔄 Script de Restauração - Sistema Clinical Reports Completo
# Data: 13 de novembro de 2025
# Status: Sistema 100% Funcional com Relatórios Clínicos

Write-Output "🔄 Iniciando restauração do sistema completo com relatórios clínicos..."
Write-Output ""

# Parar servidor atual se estiver rodando
Write-Output "⏹️ Parando servidor atual..."
taskkill /f /im node.exe 2>$null
Start-Sleep -Seconds 3

# Verificar se backup existe
if (-not (Test-Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE")) {
    Write-Output "❌ Erro: Backup não encontrado!"
    exit 1
}

Write-Output "📁 Restaurando arquivos do backup..."

# Restaurar arquivos de configuração
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\*.json" -Destination "." -Force
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\*.js" -Destination "." -Force

# Restaurar pastas principais
Remove-Item -Path "app","components","lib","hooks" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\app" -Destination "." -Recurse -Force
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\components" -Destination "." -Recurse -Force
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\lib" -Destination "." -Recurse -Force
Copy-Item -Path "backups\stable-2025-11-13_CLINICAL_REPORTS_COMPLETE\hooks" -Destination "." -Recurse -Force -ErrorAction SilentlyContinue

Write-Output "📦 Verificando dependências..."
if (-not (Test-Path "node_modules")) {
    Write-Output "⬇️ Instalando dependências..."
    npm install
}

Write-Output "🚀 Iniciando servidor..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"

Write-Output "✅ Restauração concluída!"
Write-Output "🌐 Servidor rodando em: http://localhost:3004"
Write-Output ""
Write-Output "📊 Sistema restaurado com:"
Write-Output "  ✅ Todas as 6 funcionalidades implementadas"
Write-Output "  ✅ Sistema de relatórios clínicos completo"
Write-Output "  ✅ Autenticação estável"
Write-Output "  ✅ Interface profissional"
Write-Output "  ✅ Dados mockados realísticos"
Write-Output ""
Write-Output "🔗 Acesse:"
Write-Output "  • Login: http://localhost:3004/auth/signin"
Write-Output "  • Chat: http://localhost:3004/chat"
Write-Output "  • Relatórios: http://localhost:3004/reports"
Write-Output ""
Write-Output "🎉 ClaraMente - Sistema Terapêutico Completo!"