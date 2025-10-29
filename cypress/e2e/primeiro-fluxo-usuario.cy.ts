describe('Fluxo completo do usuário', () => {
  it('Onboarding, login, chat, pagamento, pânico, psicólogo e relatório', () => {
    // Onboarding
    cy.visit('/onboarding');
    cy.get('[data-testid="language-switcher"] button', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="language-switcher"] button').first().click();
    cy.get('[data-testid="persona-picker"] button').first().click();
    cy.get('[data-testid="style-picker"] button').first().click();
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input[type="checkbox"]').last().check();
    cy.contains('Iniciar sessão').click();

    // Chat
    cy.url().should('include', '/chat');
    cy.get('input[placeholder="Digite sua mensagem..."]').type('Olá, quero conversar!');
    cy.contains('Enviar').click();
    cy.contains('Olá, quero conversar!').should('exist');
    cy.contains('Buscar ajuda profissional').click();

    // Pagamento
    cy.visit('/pricing');
    cy.contains('Assinar').click();
    cy.contains('Pagamento realizado com sucesso').should('exist');

    // Psicólogo
    cy.visit('/psychologists');
    cy.get('[data-testid="psychologist-card"]').first().click();
    cy.contains('Profissional selecionado').should('exist');

    // Relatório
    cy.visit('/report');
    cy.contains('Gerar relatório').click();
    cy.contains('Relatório da sessão').should('exist');
  });
});
