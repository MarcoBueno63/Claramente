describe('Fluxo completo do usuário', () => {
  it('Onboarding, login, chat, pagamento, pânico, psicólogo e relatório', () => {
    // Setup: garantir usuário consistente no localStorage
    cy.visit('/onboarding', {
      onBeforeLoad(win) {
        win.localStorage.setItem('claramente_user', JSON.stringify({
          id: 'cypress-tester',
          locale: 'pt-BR',
          freeSessionsUsed: 0
        }));
      }
    });
    // Avançar até o passo 3 (Personalização)
    for (let i = 0; i < 3; i++) {
      cy.contains('Próximo').click();
    }
    cy.wait(1000);
    cy.screenshot('onboarding-step-3');
    cy.get('[data-testid="language-switcher"] button', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="language-switcher"] button').first().click();
    cy.get('[data-testid="persona-picker"] button').first().click();
    cy.get('[data-testid="style-picker"] button').first().click();
    cy.get('input[type="checkbox"]').should('have.length.at.least', 2);
    cy.get('input[type="checkbox"]').each($el => cy.wrap($el).should('be.visible').check({ force: true }));
    cy.contains('Começar Terapia Agora').should('not.be.disabled');
    cy.wait(500);
    cy.contains('Começar Terapia Agora').click();
    cy.url({ timeout: 10000 }).should('include', '/chat');

    // Chat
    cy.url().should('include', '/chat');
    cy.get('input[placeholder="Digite sua mensagem..."]').type('Olá, quero conversar!');
    cy.contains('Enviar').click();
    cy.contains('Olá, quero conversar!').should('exist');
    // Valida a mensagem de boas-vindas real do assistente
    cy.contains('Sou um complemento ao tratamento profissional, não um substituto').should('exist');

    // Pagamento
    cy.visit('/pricing');
    cy.contains('Assinar').click();
    // Valida o modal de paywall exibido após o pagamento
    cy.contains('Continue seu progresso').should('exist');

    // Psicólogo
    cy.visit('/psychologists');
    cy.get('[data-testid="psychologist-card"]').first().as('card');
    cy.get('@card').contains('Indicar/Agendar').click();
    cy.get('@card').contains('Dra. Teste Cypress').should('exist');

    // Relatório
    cy.visit('/report');
    cy.contains('Gerar relatório').should('exist').click();
    cy.contains('Relatório de Sessões').should('exist');
  });
});
