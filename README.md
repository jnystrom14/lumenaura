# LumenAura

A React TypeScript web application providing personalized daily numerology guidance using Louise Hay's "Colors & Numbers" system.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth (email/password + Google OAuth)
- **Database**: Supabase PostgreSQL
- **State Management**: React Context + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns + react-day-picker
- **PDF Generation**: jsPDF + jspdf-autotable
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard and date controls
│   ├── numerology/        # Numerology display components
│   ├── onboarding/        # User onboarding flow
│   ├── calendar/          # Calendar view components
│   └── ui/                # shadcn/ui components
├── data/
│   └── numerology/        # Louise Hay numerology dataset
├── hooks/
│   ├── auth/              # Authentication hooks
│   └── use-*.tsx          # Custom hooks
├── integrations/
│   └── supabase/          # Supabase client and types
├── pages/                 # Route pages
├── services/              # API services
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── styles/                # Global styles
```

## Development Setup

1. **Clone and install**:
   ```bash
   git clone <repo-url>
   cd lumenaura
   npm install
   ```

2. **Environment variables**:
   ```bash
   # .env.local
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start development**:
   ```bash
   npm run dev    # Development server
   npm run build  # Production build
   npm run lint   # ESLint
   ```

## Architecture

### Numerology Engine (`src/utils/numerologyCalculator.ts`)

Core calculation functions:
- `calculateUniversalYear(year)` - Sum of year digits
- `calculatePersonalYear(birthMonth, birthDay, year)` - Personal year calculation
- `getDailyProfile(userProfile, date)` - Complete daily profile generation

### Data Structure

```typescript
interface UserProfile {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  profilePicture?: string;
}

interface DailyProfile {
  date: Date;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  numerologyData: NumerologyData;
  personalYearData: NumerologyData;
}
```

### Authentication Flow

1. **AuthenticationWrapper** - Top-level auth state management
2. **useAuthState** - Auth hook with Supabase integration
3. **Authentication** - Login/signup forms
4. **Guest mode** - Local storage fallback

### Component Architecture

- **Dashboard** - Main view controller
- **DateControls** - Date picker and view toggles
- **NumerologyCard** - Daily profile display
- **MonthlyCalendar** - Calendar grid view
- **DateRangeCalendar** - Multi-date view

## Key Features

### Numerology Calculations
- Louise Hay's "Colors & Numbers" system implementation
- Personal day/month/year calculations with proper reduction
- Master numbers (11→2, 22→4) with spiritual significance tracking
- Visual indicators for master number origins
- Consistent calendar year methodology

### PDF Export
- jsPDF integration for calendar export
- Responsive table generation
- Custom styling and branding

### Authentication
- Supabase Auth with Google OAuth
- Persistent sessions with localStorage fallback
- Samsung browser compatibility handling

### Responsive Design
- Mobile-first Tailwind CSS
- Adaptive date picker controls
- Touch-friendly interactions

## Scripts

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview build
npm run lint         # ESLint check
```

## Database Schema

Supabase handles user profiles and authentication. Local storage used for guest users.

## Deployment

Optimized for static hosting (Vercel, Netlify):
- Client-side routing
- Environment variable support
- Build-time optimizations

## Development Notes

- TypeScript strict mode enabled
- ESLint + Prettier configuration
- Component-driven architecture
- Custom hook patterns for business logic
- Error boundary implementations