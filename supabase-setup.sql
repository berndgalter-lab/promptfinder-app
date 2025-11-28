-- PromptFinder: Beispiel Workflow mit prompt_template
-- Füge dies in deine Supabase SQL-Console ein

-- 1. Stelle sicher, dass die workflows Tabelle existiert
CREATE TABLE IF NOT EXISTS workflows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  tier TEXT CHECK (tier IN ('essential', 'advanced')) DEFAULT 'essential',
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS aktivieren
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- 3. Policy für öffentlichen Lesezugriff
DROP POLICY IF EXISTS "Anyone can view workflows" ON workflows;
CREATE POLICY "Anyone can view workflows" 
ON workflows FOR SELECT TO public USING (true);

-- 4. Beispiel Workflow mit prompt_template
INSERT INTO workflows (title, description, slug, tier, steps) VALUES (
  'SEO Blog Post Generator',
  'Generate SEO-optimized blog posts with AI',
  'seo-blog-post',
  'essential',
  '[
    {
      "title": "Define Your Topic",
      "description": "Tell us what you want to write about",
      "prompt_template": "Write a blog post about {{topic}}. The target audience is {{audience}}. Use a {{tone}} tone.",
      "fields": [
        {
          "name": "topic",
          "label": "Blog Topic",
          "type": "text",
          "placeholder": "e.g., AI in Healthcare",
          "required": true
        },
        {
          "name": "audience",
          "label": "Target Audience",
          "type": "text",
          "placeholder": "e.g., Healthcare professionals",
          "required": true
        },
        {
          "name": "tone",
          "label": "Tone",
          "type": "select",
          "placeholder": "Select tone",
          "required": true,
          "options": ["Professional", "Casual", "Friendly", "Academic", "Conversational"]
        }
      ]
    },
    {
      "title": "Content Requirements",
      "description": "Specify what should be included",
      "prompt_template": "Include these keywords: {{keywords}}\\n\\nWord count: approximately {{word_count}} words\\n\\nAdditional notes:\\n{{notes}}",
      "fields": [
        {
          "name": "keywords",
          "label": "Target Keywords (comma-separated)",
          "type": "text",
          "placeholder": "e.g., machine learning, automation, efficiency",
          "required": true
        },
        {
          "name": "word_count",
          "label": "Word Count",
          "type": "select",
          "placeholder": "Select length",
          "required": true,
          "options": ["500", "1000", "1500", "2000", "2500"]
        },
        {
          "name": "notes",
          "label": "Additional Instructions",
          "type": "textarea",
          "placeholder": "Any specific requirements, structure, or style guidelines...",
          "required": false
        }
      ]
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  steps = EXCLUDED.steps;

-- 5. Weitere Beispiel-Workflows
INSERT INTO workflows (title, description, slug, tier, steps) VALUES (
  'Email Marketing Campaign',
  'Create engaging email campaigns',
  'email-marketing',
  'advanced',
  '[
    {
      "title": "Campaign Setup",
      "description": "Define your email campaign",
      "prompt_template": "Create an email campaign for {{product}} targeting {{audience}}. The goal is to {{goal}}.",
      "fields": [
        {
          "name": "product",
          "label": "Product/Service Name",
          "type": "text",
          "placeholder": "e.g., Premium CRM Software",
          "required": true
        },
        {
          "name": "audience",
          "label": "Target Audience",
          "type": "text",
          "placeholder": "e.g., Small business owners",
          "required": true
        },
        {
          "name": "goal",
          "label": "Campaign Goal",
          "type": "select",
          "required": true,
          "options": ["Increase sales", "Generate leads", "Boost engagement", "Announce new feature", "Re-engage customers"]
        }
      ]
    },
    {
      "title": "Email Content",
      "description": "Specify the content details",
      "prompt_template": "Email subject should be {{subject_style}}. Include a call-to-action: {{cta}}. Tone should be {{tone}}.",
      "fields": [
        {
          "name": "subject_style",
          "label": "Subject Line Style",
          "type": "select",
          "required": true,
          "options": ["Urgent", "Curiosity-driven", "Value-focused", "Question-based", "Personalized"]
        },
        {
          "name": "cta",
          "label": "Call-to-Action",
          "type": "text",
          "placeholder": "e.g., Sign up for free trial",
          "required": true
        },
        {
          "name": "tone",
          "label": "Tone",
          "type": "select",
          "required": true,
          "options": ["Professional", "Friendly", "Urgent", "Casual", "Formal"]
        }
      ]
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  steps = EXCLUDED.steps;

INSERT INTO workflows (title, description, slug, tier, steps) VALUES (
  'Social Media Post Creator',
  'Generate engaging social media content',
  'social-media-post',
  'essential',
  '[
    {
      "title": "Post Details",
      "description": "Define your social media post",
      "prompt_template": "Create a {{platform}} post about {{topic}}. Style: {{style}}. Include {{hashtags_count}} relevant hashtags.",
      "fields": [
        {
          "name": "platform",
          "label": "Platform",
          "type": "select",
          "required": true,
          "options": ["LinkedIn", "Twitter/X", "Instagram", "Facebook", "TikTok"]
        },
        {
          "name": "topic",
          "label": "Topic",
          "type": "text",
          "placeholder": "e.g., Product launch announcement",
          "required": true
        },
        {
          "name": "style",
          "label": "Style",
          "type": "select",
          "required": true,
          "options": ["Informative", "Inspirational", "Humorous", "Educational", "Promotional"]
        },
        {
          "name": "hashtags_count",
          "label": "Number of Hashtags",
          "type": "select",
          "required": true,
          "options": ["3", "5", "7", "10"]
        }
      ]
    }
  ]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  steps = EXCLUDED.steps;

-- Fertig! Testen unter: /workflows/seo-blog-post

