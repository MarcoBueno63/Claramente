// app/protocols/page.tsx - Página de Protocolos TCC Especializados
// Interface para protocolos baseados em evidências para transtornos específicos

import { Metadata } from 'next';
import TCCProtocols from '../../components/TCCProtocols';

export const metadata: Metadata = {
  title: 'Protocolos TCC Especializados | ClaraMente',
  description: 'Protocolos estruturados baseados em evidências para tratamento de transtornos específicos. TAG, Depressão, TOC, Fobias e mais.',
  keywords: 'protocolos TCC, terapia cognitivo comportamental, TAG, depressão, TOC, fobias, tratamento estruturado',
  openGraph: {
    title: 'Protocolos TCC Especializados | ClaraMente',
    description: 'Sistema completo de protocolos terapêuticos baseados em evidências',
    type: 'website',
  },
};

export default function ProtocolsPage() {
  return <TCCProtocols />;
}