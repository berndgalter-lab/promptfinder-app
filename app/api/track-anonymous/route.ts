import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * DSGVO-KONFORME API für anonymes Workflow-Tracking
 * 
 * Diese API speichert NUR:
 * - Workflow-ID (welcher Workflow wurde genutzt)
 * - Datum (wann wurde er genutzt)
 * - Aggregierter Counter (+1)
 * 
 * Diese API speichert NICHT:
 * - IP-Adressen
 * - User-Agent
 * - Cookies
 * - Session-IDs
 * - Andere persönliche Daten
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId } = body;

    // Validierung
    if (!workflowId || typeof workflowId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid workflowId' },
        { status: 400 }
      );
    }

    // Basis-Validierung (nicht leer, max. 100 Zeichen)
    if (workflowId.length === 0 || workflowId.length > 100) {
      return NextResponse.json(
        { error: 'Invalid workflowId format' },
        { status: 400 }
      );
    }

    // Admin-Client verwenden (umgeht RLS)
    const supabase = createAdminClient();

    // Aggregierte Statistik erhöhen via RPC-Funktion
    // DSGVO-konform: nur Zähler, keine User-Daten
    const { error } = await supabase.rpc('increment_anonymous_usage', { 
      p_workflow_id: workflowId 
    });

    if (error) {
      console.error('Error incrementing anonymous usage:', error);
      // Still return success to not break user experience
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking anonymous usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

