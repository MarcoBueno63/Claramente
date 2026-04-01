// Serviço de pagamento - estrutura para integração real

export async function processPayment(_userId: string, _amount: number) {
  void _userId;
  void _amount;
  // Aqui você pode integrar com API de pagamento real
  // Exemplo: await fetch('https://api.pagamento.com/pay', ...)
  // Mock para testes:
  return new Promise<{ success: boolean }>((resolve) => setTimeout(() => resolve({ success: true }), 2000));
}
