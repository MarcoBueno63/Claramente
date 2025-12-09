// Serviço de profissionais - estrutura para integração real

export async function getProfessionals() {
  // Aqui você pode integrar com API/banco de dados real
  // Exemplo: await fetch('https://api.claramente.com/professionals')
  // Mock para testes:
  return [
    { id: 1, name: "Dr. Ana Paula", role: "Psicóloga" },
    { id: 2, name: "Dr. João Silva", role: "Psicólogo" },
    { id: 3, name: "Dr. Carla Mendes", role: "Psicóloga" },
  ];
}
