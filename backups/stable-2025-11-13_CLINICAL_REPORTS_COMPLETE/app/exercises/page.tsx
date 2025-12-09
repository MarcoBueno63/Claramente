// app/exercises/page.tsx - Página dos Exercícios Terapêuticos
// Interface principal para acesso aos exercícios personalizados

"use client";
import { Suspense } from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import TherapeuticExercises from '../../components/TherapeuticExercises';

export default function ExercisesPage() {
  return (
    <AuthGuard>
      <div className="exercises-page">
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando exercícios...</p>
            </div>
          </div>
        }>
          <TherapeuticExercises />
        </Suspense>
      </div>
    </AuthGuard>
  );
}