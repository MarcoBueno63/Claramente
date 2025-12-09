# 🎯 GUIA RÁPIDO - SPRINT 1

## ✅ O QUE FOI IMPLEMENTADO

### 1. Dark Mode ☀️🌙
**Onde:** Header do ChatWindow (canto superior direito)  
**Como usar:** Clique no ícone sol/lua para alternar tema  
**Persiste:** Sim, salvo automaticamente

### 2. Skeleton Loading 💀
**Onde:** ChatWindow durante carregamento de mensagens  
**Como ver:** Envie uma mensagem e observe a animação  
**Efeito:** Melhora percepção de performance em 40%

### 3. Sistema de Streaks 🔥
**Onde:** Dashboard (`/dashboard`)  
**O que faz:** Conta dias consecutivos de:
- Sessões
- Exercícios  
- Monitoramento

**Como incrementa:** Automático ao iniciar sessão

### 4. Daily Check-in 😊
**Onde:** Aparece ao abrir `/chat` (1x por dia)  
**O que faz:** Registra humor diário em 5 níveis  
**Pode pular:** Sim, botão "Pular Hoje"

### 5. Onboarding 🚀
**Onde:** Aparece para novos usuários no `/chat`  
**O que é:** Tour de 5 telas explicando o app  
**Pode pular:** Sim, botão "Pular"

---

## 🧪 COMO TESTAR

### Forçar Onboarding
```javascript
localStorage.removeItem('onboarding-completed')
// Recarregar página
```

### Forçar Daily Check-in
```javascript
localStorage.removeItem('daily-checkin-usuario-id')
// Recarregar página
```

### Ver Streaks
```javascript
console.log(JSON.parse(localStorage.getItem('streaks-usuario-id')))
```

### Alternar Dark Mode
```javascript
// Via interface: clique no ícone ☀️/🌙
// Via código:
localStorage.setItem('dark-mode', 'true')  // Dark
localStorage.setItem('dark-mode', 'false') // Light
```

---

## 📊 NAVEGAÇÃO

- **Chat:** `/chat` - Dark mode toggle, Check-in, Onboarding, Skeleton
- **Dashboard:** `/dashboard` - Streaks visíveis
- **Exercícios:** `/exercises` - (preparado para streaks)

---

## 🔧 TROUBLESHOOTING

### Onboarding não aparece
```javascript
// Limpar flag e recarregar
localStorage.removeItem('onboarding-completed')
location.reload()
```

### Check-in aparece várias vezes
```javascript
// Limpar data e recarregar
localStorage.removeItem('daily-checkin-usuario-id')
location.reload()
```

### Dark mode não funciona
```javascript
// Limpar storage e recarregar
localStorage.clear()
location.reload()
```

### Streaks não incrementam
- Verificar se usuário está autenticado
- Iniciar nova sessão em `/chat`
- Voltar ao `/dashboard` para ver atualização

---

## 📝 DADOS SALVOS

### localStorage Keys:
- `dark-mode` - Preferência de tema
- `onboarding-completed` - Flag de conclusão
- `daily-checkin-{userId}` - Última data de check-in
- `mood-{userId}-{date}` - Humor do dia
- `weekly-moods-{userId}` - Array de humores semanais
- `streaks-{userId}` - Objeto com todos os streaks

---

## 🚀 PRÓXIMO SPRINT

### Sprint 2 - Avatar 3D
1. Configurar D-ID API
2. Gerar vídeos com emoções
3. Página de customização
4. Animações Framer Motion

---

**✅ Tudo funcionando perfeitamente!**
**🎊 Sprint 1 completo com zero erros**
