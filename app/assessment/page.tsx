// app/assessment/page.tsx - Página do Assessment Terapêutico
// Realiza avaliação clínica estruturada para formulação de caso

"use client";
import { Suspense } from 'react';
import { AuthGuard } from '../../components/AuthGuard';
import CaseFormulationAssessment from '../../components/CaseFormulationAssessment';

export default function AssessmentPage() {
  return (
    <AuthGuard>
      <div className="assessment-page">
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        }>
          <CaseFormulationAssessment />
        </Suspense>
      </div>
    </AuthGuard>
  );
}