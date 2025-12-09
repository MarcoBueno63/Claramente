"use client";
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Carregamento lazy do ProgressDashboard para melhor performance
const ProgressDashboard = dynamic(() => import('../../components/ProgressDashboard'), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Carregando relatórios...</span>
    </div>
  ),
  ssr: false
})

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Progresso</h1>
          <p className="text-gray-600 mt-2">Acompanhe sua evolução terapêutica</p>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <ProgressDashboard />
        </Suspense>
      </div>
    </div>
  )
}
