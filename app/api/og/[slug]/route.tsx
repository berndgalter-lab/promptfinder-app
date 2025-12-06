import { ImageResponse } from 'next/og';

export const runtime = 'edge';

interface WorkflowData {
  title: string;
  description: string;
  icon: string | null;
  category: { name: string; icon: string } | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Fetch workflow data using REST API (Edge Runtime compatible)
  let workflow: WorkflowData | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/workflows?slug=eq.${slug}&select=title,description,icon,category:categories(name,icon)`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      }
    );
    const data = await response.json();
    workflow = data?.[0] || null;
  } catch (error) {
    console.error('Error fetching workflow for OG image:', error);
  }

  if (!workflow) {
    // Return a default/error image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            color: 'white',
            fontSize: 32,
          }}
        >
          Workflow not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const categoryName = workflow.category?.name || 'Workflow';
  const categoryIcon = workflow.category?.icon || '📝';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#18181b',
          padding: '48px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background gradient effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Main content - centered */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: '80px', marginBottom: '24px' }}>
            {workflow.icon || '📝'}
          </span>

          {/* Title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'white',
              margin: 0,
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            {workflow.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              margin: 0,
              marginBottom: '32px',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            {workflow.description}
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* FREE Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '9999px',
                color: '#4ade80',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              <span>✨</span>
              <span>FREE</span>
            </div>

            {/* Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#27272a',
                border: '1px solid #3f3f46',
                borderRadius: '9999px',
                color: '#d4d4d8',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              <span>{categoryIcon}</span>
              <span>{categoryName}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid #27272a',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#18181b',
              }}
            >
              P
            </div>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'white',
              }}
            >
              PromptFinder
            </span>
          </div>

          {/* URL */}
          <span
            style={{
              fontSize: '18px',
              color: '#71717a',
            }}
          >
            prompt-finder.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

