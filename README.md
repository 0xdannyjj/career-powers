# CareerPowers - AI-Powered Career Superpower Discovery

CareerPowers is a cutting-edge web application that uses AI to help professionals discover their unique career superpowers through a scientifically-designed 6-question assessment.

## Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4o-mini for personalized insights
- **6-Question Assessment**: Scientifically designed questions covering all MBTI dimensions
- **Beautiful Results**: Shareable superpower cards with custom designs
- **Email Lead Generation**: Automated email capture and follow-up sequences
- **Social Sharing**: Built-in viral sharing mechanisms
- **Analytics Tracking**: Comprehensive user behavior and conversion tracking

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Vercel Serverless Functions, Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini API
- **UI Components**: Shadcn/ui, Lucide React Icons
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend (planned integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Update the `.env.local` file with your actual values:
   
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

   # OpenAI Configuration  
   OPENAI_API_KEY=your_actual_openai_api_key

   # Email Configuration (Optional)
   RESEND_API_KEY=your_resend_api_key

   # Next.js Configuration
   NEXTAUTH_SECRET=your_random_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Set up Supabase database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Copy the contents of schema.sql and run in Supabase SQL editor
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── assessment/        # Assessment page
│   ├── results/          # Results page
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── assessment/       # Assessment-related components
│   └── results/          # Results-related components
├── lib/                  # Utility libraries
│   ├── openai.ts        # OpenAI integration
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # General utilities
├── store/               # State management
│   └── assessment.ts    # Assessment state (Zustand)
└── types/               # TypeScript definitions
    ├── assessment.ts    # Assessment types
    └── database.ts      # Database types
```

## Key Features Implementation

### 1. AI-Powered Assessment
- 6 strategically designed questions covering all MBTI dimensions
- OpenAI GPT-4o-mini integration for personalized analysis
- Fallback rule-based analysis for reliability

### 2. Viral Sharing Mechanics
- Social platform sharing (LinkedIn, Twitter, Facebook)
- Custom superpower card generation
- Shareable URLs with referral tracking

### 3. Lead Generation System
- Email capture with compelling value propositions
- Automated follow-up sequences (ready for Resend integration)
- GDPR-compliant data handling

### 4. Analytics & Tracking
- User behavior tracking
- Conversion funnel analysis
- A/B testing ready infrastructure

## Development Status

### ✅ Completed Features
- Project setup and architecture
- Next.js 14 with TypeScript and TailwindCSS
- Supabase database and authentication setup
- OpenAI API integration for MBTI analysis
- 6-question assessment engine
- Landing page with compelling value proposition
- Card-based mobile-first assessment interface
- AI-powered superpower card generation
- Email capture and automation system
- Social sharing functionality
- Analytics and performance monitoring

### 🔧 Ready for Configuration
- Environment variables setup
- Supabase database deployment
- OpenAI API key configuration
- Email service integration (Resend)

## Next Steps

1. **Set up environment variables** with your actual API keys
2. **Deploy Supabase database** using the provided schema.sql
3. **Configure OpenAI API** for AI analysis
4. **Test the complete user flow** from landing page to results
5. **Deploy to Vercel** for production use

## Built With

- Next.js 14 (App Router)
- TypeScript for type safety
- TailwindCSS for styling
- Framer Motion for animations
- Supabase for database and auth
- OpenAI GPT-4o-mini for AI analysis
- Zustand for state management
- Shadcn/ui for UI components

---

**Ready to discover career superpowers! 🚀**
