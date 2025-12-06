import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * DSGVO-KONFORME API für anonymes Workflow-Tracking
 * 
 * Speichert NUR: Datum + aggregierter Counter
 * Speichert NICHT: IP, User-Agent, Cookies, Session-IDs
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { workflowId } = body;

    console.log('[track-anonymous] Received body:', body);

    // Validierung - akzeptiere string oder number
    if (workflowId === undefined || workflowId === null) {
      console.log('[track-anonymous] Missing workflowId');
      return NextResponse.json({ error: 'Missing workflowId' }, { status: 400 });
    }

    // Konvertiere zu String (falls number)
    workflowId = String(workflowId);

    const supabase = createAdminClient();
    const today = new Date().toISOString().split('T')[0];

    console.log('[track-anonymous] Tracking:', { workflowId, date: today });

    // Methode 1: Versuche RPC-Funktion (wenn SQL ausgeführt wurde)
    const { error: rpcError } = await supabase.rpc('increment_anonymous_usage', { 
      p_workflow_id: String(workflowId) 
    });

    if (rpcError) {
      console.log('[track-anonymous] RPC not available, trying direct insert:', rpcError.message);
      
      // Methode 2: Direkter Insert/Update als Fallback
      // Erst prüfen ob Eintrag existiert
      const { data: existing } = await supabase
        .from('global_daily_stats')
        .select('total_anonymous')
        .eq('date', today)
        .single();

      if (existing) {
        // Update existierenden Eintrag
        const { error: updateError } = await supabase
          .from('global_daily_stats')
          .update({ 
            total_anonymous: (existing.total_anonymous || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('date', today);

        if (updateError) {
          console.error('[track-anonymous] Update error:', updateError);
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to update stats. Make sure SQL migration was run.' 
          }, { status: 500 });
        }
      } else {
        // Neuen Eintrag erstellen
        const { error: insertError } = await supabase
          .from('global_daily_stats')
          .insert({ 
            date: today, 
            total_anonymous: 1,
            total_logged_in: 0
          });

        if (insertError) {
          console.error('[track-anonymous] Insert error:', insertError);
          return NextResponse.json({ 
            success: false, 
            error: 'Failed to insert stats. Make sure SQL migration was run.',
            details: insertError.message
          }, { status: 500 });
        }
      }
    }

    console.log('[track-anonymous] Success');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[track-anonymous] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
