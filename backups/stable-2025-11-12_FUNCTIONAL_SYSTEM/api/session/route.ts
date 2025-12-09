import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "../../../lib/session-manager";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    // Obter estatísticas do usuário
    const userStats = await SessionManager.getUserStats(userId);
    
    // Obter estado atual do sistema (debug)
    const systemStats = SessionManager.getMemoryStoreStats();
    
    console.log(`📊 Estatísticas solicitadas para usuário: ${userId}`);

    return NextResponse.json({
      success: true,
      userId,
      userStats,
      systemStats, // Informações de debug do sistema
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId é obrigatório'
      }, { status: 400 });
    }

    let result;
    
    switch (action) {
      case 'create_session':
        result = await SessionManager.createSession(userId);
        break;
        
      case 'end_active_session':
        const activeSession = await SessionManager.getActiveSession(userId);
        if (activeSession) {
          await SessionManager.endSession(activeSession.id, 'Sessão finalizada manualmente');
          result = { message: 'Sessão finalizada com sucesso' };
        } else {
          result = { message: 'Nenhuma sessão ativa encontrada' };
        }
        break;
        
      case 'get_active_session':
        result = await SessionManager.getActiveSession(userId);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Ação não reconhecida'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na ação de sessão:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}