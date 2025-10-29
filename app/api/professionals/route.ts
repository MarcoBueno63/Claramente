import { NextResponse } from "next/server";

// Lista simulada de profissionais
const professionals = [
  { id: 1, name: "Dr. Ana Paula", role: "Psicóloga" },
  { id: 2, name: "Dr. João Silva", role: "Psicólogo" },
  { id: 3, name: "Dr. Carla Mendes", role: "Psicóloga" },
];

export async function GET() {
  // No futuro, buscar do banco de dados
  return NextResponse.json(professionals);
}
