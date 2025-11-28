import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/workflows';
  const action = searchParams.get('action');
  const workflowId = searchParams.get('workflowId');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Handle favorite action after successful login
      if (action === 'favorite' && workflowId) {
        try {
          // Save favorite
          await supabase
            .from('user_favorites')
            .insert({
              user_id: data.user.id,
              workflow_id: workflowId,
            })
            .select()
            .single();
          
          console.log('✅ Favorite saved after login:', workflowId);
        } catch (favoriteError) {
          console.error('Error saving favorite after login:', favoriteError);
          // Continue even if favorite fails - user is logged in
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error, redirect to home page
  return NextResponse.redirect(`${origin}/`);
}

