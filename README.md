# PromptFinder

**AI Prompt Library with Multi-Step Workflows**

A Next.js application that helps users create, manage, and execute AI prompts through guided workflows. Features include user authentication, subscription management, usage tracking, and an achievement system.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Lemon Squeezy
- **Deployment:** Vercel-ready

---

## 📁 Project Structure

```
promptfinder/
├── app/                          # Next.js App Router pages
│   ├── workflows/[slug]/         # Dynamic workflow pages
│   ├── dashboard/                # User dashboard
│   ├── pricing/                  # Pricing & subscription
│   └── api/webhooks/             # Lemon Squeezy webhooks
│
├── components/
│   ├── workflow/                 # Workflow system components
│   │   ├── WorkflowRunner.tsx    # Main workflow orchestrator
│   │   └── steps/                # Step components (Prompt, Instruction, Input)
│   ├── auth/                     # Authentication UI
│   ├── dashboard/                # Dashboard components
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── types/workflow.ts         # TypeScript types for workflows
│   ├── supabase/                 # Supabase clients
│   ├── subscription.ts           # Subscription logic
│   ├── usage-tracking.ts         # Usage limits & tracking
│   └── achievements.ts           # Achievement system
│
├── supabase/
│   ├── migrations/               # Database migrations
│   ├── supabase-setup.sql        # Initial database setup
│   └── supabase-usage-tracking.sql # Usage tracking tables
│
└── docs/
    ├── workflow-creation/         # 📝 Workflow creation guides
    │   ├── README.md              # Guide overview
    │   ├── WORKFLOW_CREATION_CHEAT_SHEET.md # Complete field reference
    │   ├── WORKFLOW_TEMPLATE.ts   # Copy-paste template
    │   └── WORKFLOW_VISUAL_GUIDE.md # UI field mapping
    ├── ENV_SETUP.md              # Environment setup guide
    ├── WORKFLOW_SYSTEM_ANALYSIS.md # Technical documentation
    ├── ACHIEVEMENTS.md           # Achievement system docs
    └── GDPR_COMPLIANCE.md        # Privacy & data handling
```

---

## 🛠️ Setup

### 1. Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- Lemon Squeezy account (for payments)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd promptfinder

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 3. Environment Configuration

See **[ENV_SETUP.md](./docs/ENV_SETUP.md)** for detailed instructions.

Required variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### 4. Database Setup

Run the SQL files in your Supabase SQL Editor in this order:

1. `supabase-setup.sql` - Core tables (workflows, users, favorites)
2. `supabase-usage-tracking.sql` - Usage tracking & achievements
3. `supabase/migrations/005_subscriptions.sql` - Subscription management

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

### General Documentation
- **[ENV_SETUP.md](./docs/ENV_SETUP.md)** - Complete environment setup guide
- **[WORKFLOW_SYSTEM_ANALYSIS.md](./docs/WORKFLOW_SYSTEM_ANALYSIS.md)** - Technical workflow system documentation
- **[ACHIEVEMENTS.md](./docs/ACHIEVEMENTS.md)** - Achievement system implementation
- **[GDPR_COMPLIANCE.md](./docs/GDPR_COMPLIANCE.md)** - Privacy & data handling

### Workflow Creation Guides
- **[Workflow Creation Overview](./docs/workflow-creation/README.md)** - Start here!
- **[Cheat Sheet](./docs/workflow-creation/WORKFLOW_CREATION_CHEAT_SHEET.md)** - Quick reference for all fields
- **[Template](./docs/workflow-creation/WORKFLOW_TEMPLATE.ts)** - Copy-paste template with validator
- **[Visual Guide](./docs/workflow-creation/WORKFLOW_VISUAL_GUIDE.md)** - Field → UI mapping

---

## 🎯 Key Features

### Workflow System
- **Single Mode:** Simple form for 1-step workflows
- **Multi-Step Mode:** Guided step-by-step workflows
- **Step Types:** Prompt, Instruction, Input
- **Auto-Detection:** Automatically determines workflow mode
- **Cross-Step Variables:** Variables available across all steps

### User Management
- Supabase authentication (email/password, OAuth)
- User profiles and preferences
- Favorite workflows
- Usage history

### Subscription System
- Free tier with usage limits
- Pro tier with unlimited access
- Lemon Squeezy integration
- Webhook-based subscription management

### Achievement System
- Progress-based achievements (First Steps → Legend)
- Streak-based achievements (3-day → 30-day streaks)
- Visual toast notifications
- Gamification for user engagement

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Make sure to set all required environment variables in your hosting platform:
- Supabase credentials
- Lemon Squeezy webhook secret
- Site URL (production domain)

### Webhook Configuration

Update Lemon Squeezy webhook URL to your production domain:
```
https://yourdomain.com/api/webhooks/lemonsqueezy
```

---

## 🧪 Testing

### Local Development
```bash
npm run dev
```

### Webhook Testing (Local)
```bash
# Install ngrok
npm install -g ngrok

# Start dev server
npm run dev

# In another terminal
ngrok http 3000

# Use ngrok URL in Lemon Squeezy webhook settings
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 📝 Code Style

- **Components:** Functional components only (no class components)
- **Styling:** Tailwind CSS (no CSS modules)
- **Server/Client:** Server components by default, client only when needed
- **File Naming:** kebab-case (e.g., `workflow-wizard.tsx`)
- **Component Naming:** PascalCase (e.g., `WorkflowWizard`)
- **TypeScript:** Strict mode enabled

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

[Your License Here]

---

## 🆘 Support

For issues and questions:
- Check documentation in `/docs`
- Review [ENV_SETUP.md](./docs/ENV_SETUP.md) for configuration issues
- Check Supabase logs for database errors
- Check Lemon Squeezy webhook logs for payment issues

---

**Built with ❤️ using Next.js 15**
