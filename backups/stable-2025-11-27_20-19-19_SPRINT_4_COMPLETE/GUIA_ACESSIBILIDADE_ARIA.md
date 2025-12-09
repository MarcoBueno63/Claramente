# 🦾 GUIA DE ACESSIBILIDADE - ARIA LABELS

## ✅ Componentes Auditados e Melhorados

### 🎯 Prioridade Alta - Já Implementados
Componentes críticos que já possuem ARIA labels adequados:

#### 1. **FontSizeControl.tsx**
```tsx
<button
  onClick={increaseFontSize}
  disabled={!canIncrease}
  aria-label="Aumentar tamanho da fonte"
  className="..."
>
  A+
</button>

<button
  onClick={decreaseFontSize}
  disabled={!canDecrease}
  aria-label="Diminuir tamanho da fonte"
  className="..."
>
  A-
</button>
```

#### 2. **HighContrastToggle.tsx**
```tsx
<button
  onClick={toggleContrast}
  title={isHighContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
  aria-label={isHighContrast ? 'Desativar modo de alto contraste' : 'Ativar modo de alto contraste'}
  aria-pressed={isHighContrast}
  role="switch"
>
  {/* Ícone */}
</button>
```

#### 3. **CrisisMode.tsx**
```tsx
<button
  onClick={() => setShowCrisis(true)}
  aria-label="Abrir modo de crise - ajuda emergencial"
  role="button"
  className="..."
>
  🆘
</button>

<div
  role="dialog"
  aria-labelledby="crisis-title"
  aria-modal="true"
  className="..."
>
  <h2 id="crisis-title">Modo Emergência</h2>
  {/* Conteúdo */}
</div>
```

#### 4. **AudioLibrary.tsx**
```tsx
<button
  onClick={playAudio}
  aria-label={`Reproduzir ${script.title}`}
  aria-pressed={isPlaying}
  role="button"
>
  ▶️
</button>

<div
  role="region"
  aria-label="Biblioteca de áudios guiados"
  className="..."
>
  {/* Conteúdo */}
</div>
```

### 📋 Checklist de Acessibilidade

#### ✅ Atributos ARIA Essenciais

**1. Labels e Descrições:**
- `aria-label` - Texto alternativo para leitores de tela
- `aria-labelledby` - Referência a elemento que labela este
- `aria-describedby` - Descrição adicional do elemento
- `aria-hidden` - Ocultar de leitores de tela (decorativo apenas)

**2. Estados e Propriedades:**
- `aria-pressed` - Estado de botões toggle (true/false)
- `aria-expanded` - Estado de elementos expansíveis
- `aria-selected` - Item selecionado em lista
- `aria-checked` - Estado de checkbox/radio
- `aria-disabled` - Elemento desabilitado
- `aria-current` - Página/item atual em navegação

**3. Regiões e Estrutura:**
- `role="dialog"` - Diálogos/modais
- `role="navigation"` - Áreas de navegação
- `role="main"` - Conteúdo principal
- `role="complementary"` - Conteúdo secundário
- `role="region"` - Seção com label
- `role="alert"` - Alertas importantes
- `role="status"` - Atualizações de status

**4. Live Regions (conteúdo dinâmico):**
- `aria-live="polite"` - Anunciar quando usuário estiver livre
- `aria-live="assertive"` - Anunciar imediatamente
- `aria-atomic="true"` - Ler região inteira ao atualizar
- `role="status"` - Para mensagens de status
- `role="alert"` - Para alertas críticos

### 🎨 Padrões de Implementação

#### Modal/Dialog
```tsx
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Título do Modal</h2>
  <p id="modal-description">Descrição do conteúdo</p>
  <button
    onClick={closeModal}
    aria-label="Fechar modal"
  >
    ✕
  </button>
</div>
```

#### Button/Toggle
```tsx
<button
  onClick={toggleFeature}
  aria-label="Alternar recurso"
  aria-pressed={isActive}
  role="switch"
>
  {isActive ? 'Ativo' : 'Inativo'}
</button>
```

#### Navegação
```tsx
<nav aria-label="Navegação principal">
  <ul role="list">
    <li>
      <a
        href="/chat"
        aria-current={currentPath === '/chat' ? 'page' : undefined}
      >
        Chat
      </a>
    </li>
  </ul>
</nav>
```

#### Form Input
```tsx
<label htmlFor="message-input" className="sr-only">
  Digite sua mensagem
</label>
<input
  id="message-input"
  type="text"
  aria-label="Campo de mensagem"
  aria-describedby="message-hint"
  aria-invalid={hasError}
  aria-errormessage={hasError ? "error-msg" : undefined}
/>
<span id="message-hint" className="text-xs">
  Pressione Enter para enviar
</span>
{hasError && (
  <span id="error-msg" role="alert">
    Mensagem não pode estar vazia
  </span>
)}
```

#### Loading/Status
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  aria-busy={isLoading}
>
  {isLoading ? 'Carregando...' : 'Conteúdo carregado'}
</div>
```

#### Lista de Opções
```tsx
<ul role="listbox" aria-label="Opções de exercícios">
  {options.map((option, index) => (
    <li
      key={option.id}
      role="option"
      aria-selected={selectedId === option.id}
      aria-posinset={index + 1}
      aria-setsize={options.length}
    >
      {option.label}
    </li>
  ))}
</ul>
```

#### Notificações
```tsx
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  Nova mensagem recebida!
</div>
```

### 🔍 Componentes Pendentes de Auditoria

#### ChatWindow.tsx
- Adicionar `role="log"` ou `role="feed"` para área de mensagens
- `aria-live="polite"` para novas mensagens
- Labels em inputs e botões

#### EmotionSelector.tsx
- `role="radiogroup"` ou `role="listbox"` para seletor
- `aria-label` em cada emoção
- `aria-selected` para emoção ativa

#### InteractiveExercises.tsx
- `aria-label` em botões de exercício
- `role="region"` para cada seção
- `aria-expanded` para seções expansíveis

#### ProgressDashboard.tsx
- Labels descritivos em gráficos
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` para barras de progresso
- `role="img"` com `aria-label` para visualizações

### ♿ Testes de Acessibilidade

#### Ferramentas Recomendadas:
1. **axe DevTools** (extensão Chrome/Firefox)
2. **WAVE** (extensão Chrome/Firefox)
3. **Lighthouse** (Chrome DevTools)
4. **NVDA** (leitor de tela gratuito para Windows)
5. **VoiceOver** (macOS/iOS nativo)

#### Checklist de Teste Manual:
- [ ] Navegação completa apenas com teclado (Tab, Enter, Esc)
- [ ] Leitores de tela anunciam todos os elementos interativos
- [ ] Modais prendem foco corretamente
- [ ] Estados (loading, error, success) são anunciados
- [ ] Formulários têm labels e validações acessíveis
- [ ] Contraste de cores ≥ 4.5:1 (AA) ou 7:1 (AAA)
- [ ] Tamanho de fonte ajustável
- [ ] Zoom de 200% mantém funcionalidade

### 📚 Referências

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Status:** ✅ Principais componentes auditados e melhorados  
**Última atualização:** Sprint 4 - Acessibilidade  
**Próximos passos:** Implementar teclado emocional com suporte ARIA completo
