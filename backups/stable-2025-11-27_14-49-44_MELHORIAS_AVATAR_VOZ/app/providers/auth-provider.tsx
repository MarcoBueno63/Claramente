"use client"

// 🚀 AUTH PROVIDER SIMPLIFICADO SEM NEXT-AUTH

export function AuthProvider({ 
  children,
  session 
}: {
  children: React.ReactNode
  session: any
}) {
  // Mock provider durante otimização
  return <>{children}</>;
}