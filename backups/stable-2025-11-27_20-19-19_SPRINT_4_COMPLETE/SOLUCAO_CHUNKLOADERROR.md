# 🔧 Solução para ChunkLoadError - Next.js

## 🚨 **Erro Comum:**
```
Loading chunk app/chat/page failed.
(error: http://localhost:3000/_next/static/chunks/app/chat/page.js)
```

## ⚡ **Soluções Rápidas:**

### **1. Hard Refresh no Navegador**
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **Ou**: F12 → Network → Disable Cache + Refresh

### **2. Limpar Cache do Next.js**
```powershell
# Parar servidor
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remover cache
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

# Reiniciar servidor
npm run dev
```

### **3. Verificar Porta Correta**
```powershell
# Ver qual porta está sendo usada
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Se necessário, matar processo bloqueando
taskkill /F /PID [PID_NUMBER]
```

### **4. Reiniciar Servidor Limpo**
```powershell
# Método seguro - usar prefix
& "C:\Program Files\nodejs\npm.cmd" --prefix "C:\Projetos\claramente" run dev
```

## 🎯 **Causas Comuns:**

1. **Mudanças no código** durante development
2. **Cache do navegador** desatualizado
3. **Build anterior** conflitando
4. **Porta incorreta** (3000 vs 3001)
5. **Processo anterior** não finalizado

## ✅ **Verificação Funcionamento:**

### **URLs Principais:**
- `http://localhost:3000/` - Página inicial
- `http://localhost:3000/chat` - Interface de chat
- `http://localhost:3000/onboarding` - Setup inicial

### **Status Check:**
```powershell
# Verificar se servidor está rodando
Invoke-WebRequest -Uri "http://localhost:3000/" -Method Get

# Verificar API de chat
Invoke-WebRequest -Uri "http://localhost:3000/api/chat" -Method Post -ContentType "application/json" -Body '{"userId":"test","message":"oi"}'
```

## 🛠️ **Solução Definitiva (se persistir):**

```powershell
# 1. Parar tudo
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name npm -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpar tudo
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reinstalar
npm install

# 4. Rebuild
npm run build

# 5. Reiniciar
npm run dev
```

## 💡 **Dicas de Prevenção:**

1. **Sempre usar Hard Refresh** após mudanças de código
2. **Evitar fechar terminal** durante desenvolvimento
3. **Usar DevTools** com cache disabled durante dev
4. **Monitorar porta** do servidor (3000 vs 3001)
5. **Restart periódico** do servidor em sessões longas

---

**Status**: ✅ **SERVIDOR FUNCIONANDO** em `http://localhost:3000`
**Última Verificação**: 10/11/2025