import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflowId = parseInt(id, 10);
    const { rating } = await request.json();

    // Validierung
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // User prüfen
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Upsert: Insert oder Update wenn schon existiert
    const { data, error } = await supabase
      .from('workflow_ratings')
      .upsert(
        {
          workflow_id: workflowId,
          user_id: user.id,
          rating: rating,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'workflow_id,user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Rating error:', error);
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, rating: data });
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Hole Rating-Stats für einen Workflow
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflowId = parseInt(id, 10);

    const supabase = await createClient();

    // Durchschnitt und Anzahl berechnen
    const { data: ratings, error } = await supabase
      .from('workflow_ratings')
      .select('rating')
      .eq('workflow_id', workflowId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch ratings' },
        { status: 500 }
      );
    }

    const count = ratings?.length || 0;
    const average = count > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

    // User's eigenes Rating (falls eingeloggt)
    const { data: { user } } = await supabase.auth.getUser();
    let userRating = null;

    if (user) {
      const { data: existingRating } = await supabase
        .from('workflow_ratings')
        .select('rating')
        .eq('workflow_id', workflowId)
        .eq('user_id', user.id)
        .single();

      userRating = existingRating?.rating || null;
    }

    return NextResponse.json({
      average: Math.round(average * 10) / 10, // 1 Dezimalstelle
      count,
      userRating,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

