# CLAUDE.md — Civitas

Read this file before writing any code. This is the source of truth for how Civitas is built.

## What We're Building
Civitas is a civic education web app for immigrant communities. Users can ask civic questions in their native language, browse structured civic topics, and learn how to get involved locally. The defining features are: multilingual support, AI-generated explanations cached in PostgreSQL, and location-aware local government data.

Read PRD.md, DESIGN.md, and TECHSTACK.md for full details.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS v3 + shadcn/ui + Framer Motion + React Router v6 + i18next
- **Backend**: FastAPI (Python) + SlowAPI (rate limiting)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API
- **Location**: Browser Geolocation API + OpenCage Geocoding
- **Deployment**: Vercel (frontend) + Railway (backend)

## Color System
- Primary: `#3B82F6` (blue) — nav, buttons, interactive elements
- Primary light: `#EFF6FF` (blue-50) — backgrounds, hover states
- Secondary: `#10B981` (green) — actions, success, get involved
- Secondary light: `#ECFDF5` (green-50) — backgrounds
- Background: `#F9FAFB` (gray-50)
- Card: `#FFFFFF`
- Text: `#111827` (gray-900)
- Text muted: `#6B7280` (gray-500)
- Border: `#E5E7EB` (gray-200)

## Design Rules
- Clean and minimal — lots of white space, nothing cluttered
- Font: Inter
- Border radius: 8px small, 12px cards, 16px large, 9999px pills
- Shadows: subtle — `0 4px 12px rgba(0,0,0,0.08)` for cards
- Page transitions: slide in from right using Framer Motion AnimatePresence
- Component entrances: fade + slight upward translate (y: 8px → 0), 250ms
- All animations respect prefers-reduced-motion
- Never go below 14px font size (elderly users)
- Touch targets minimum 44x44px

## Project Structure
```
civitas/
  CLAUDE.md
  PRD.md
  DESIGN.md
  TECHSTACK.md
  frontend/
    src/
      components/
        layout/
          Navbar.tsx
          PageTransition.tsx
        home/
          AIGlobe.tsx
          ChatInput.tsx
          SuggestedQuestions.tsx
          ChatResponse.tsx
        topics/
          CategoryGrid.tsx
          TopicList.tsx
          TopicExplanation.tsx
        local/
          RepresentativeCard.tsx
          EventCard.tsx
          OrganizationCard.tsx
      pages/
        Home.tsx
        Topics.tsx
        Rights.tsx
        GetInvolved.tsx
        Politics.tsx
        Settings.tsx
      hooks/
        useLocation.ts
        useLanguage.ts
        useAuth.ts
      lib/
        api.ts
        supabase.ts
        types.ts
      i18n/
        en.json
        es.json
        zh.json
      App.tsx
      main.tsx
  backend/
    main.py
    routers/
      chat.py
      topics.py
      local.py
      auth.py
    services/
      claude_service.py
      cache_service.py
      location_service.py
      translation_service.py
    models/
      schemas.py
    middleware/
      rate_limit.py
    seeds/
      categories.py
      local_data.py
    .env
```

## Environment Variables

Frontend (.env):
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENCAGE_API_KEY=your_opencage_key
```

Backend (.env):
```
ANTHROPIC_API_KEY=your_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## API Endpoints
```
POST /chat                    # AI civic question answering
GET  /topics                  # Get all categories
GET  /topics/:category        # Get topics in category
GET  /topics/:category/:topic # Get topic explanation
GET  /local                   # Get local reps/orgs/events by city
POST /auth/signup             # Create account
POST /auth/login              # Login
```

## Rate Limiting Rules
- `/chat`: 10 requests per minute per IP
- `/topics/*`: 20 requests per minute per IP
- `/auth/*`: 5 requests per minute per IP
- All other routes: 100 requests per minute per IP
- Return 429 with retry-after header on limit exceeded

## Security Rules
- Never put secret API keys in frontend code
- CORS: only allow requests from frontend origin
- All user input validated with Pydantic before processing
- Max question length: 500 characters
- Strip HTML from all user input
- Use Supabase RLS on user_progress and bookmarks tables
- Never write raw SQL with string concatenation

## Caching Strategy
- Every Claude API response is cached in Supabase
- Chat cache key: MD5 hash of (question + language_code)
- Topic cache key: topic_id + language_code
- Always check cache before calling Claude API
- Cache hit → serve instantly, no API call
- Cache miss → call Claude → store → serve

## Multilingual Rules
- i18next handles all static UI text (nav, buttons, labels, placeholders)
- Claude API handles all civic content (explanations, chat responses)
- Always generate content in English first, then translate to target language
- Store translations in DB per language — never regenerate a cached translation
- Language preference stored in localStorage and user account if logged in
- ALL text on page must change when language is switched — no English left behind

## Claude API Usage
- Model: claude-sonnet-4-20250514
- Max tokens: 1000 for chat, 2000 for topic explanations
- Always check cache before API call
- System prompt must enforce plain language (8th grade reading level)
- System prompt must enforce response in user's selected language
- For translations: prompt must return ONLY the translated text, no extra commentary

## TypeScript Types (frontend/src/lib/types.ts)
```typescript
export type Language = {
  code: string;
  name: string;
};

export type Category = {
  id: string;
  slug: string;
  icon: string;
  color: 'blue' | 'green';
  name: string;
  description: string;
};

export type Topic = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  what_it_is?: string;
  why_it_matters?: string;
  what_you_can_do?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
};

export type Source = {
  title: string;
  url: string;
  summary: string;
};

export type LocalData = {
  id: string;
  type: 'representative' | 'organization' | 'event';
  city: string;
  data: Record<string, any>;
};
```

## Build Order (follow this exactly)
1. Scaffold frontend (Vite + React + TypeScript)
2. Install all frontend dependencies
3. Set up Tailwind v3 + shadcn/ui
4. Set up React Router with all page shells (empty pages)
5. Build Navbar component
6. Set up page transitions with Framer Motion
7. Set up i18next with English, Spanish, Mandarin JSON files
8. Build Home page — AIGlobe, SuggestedQuestions, ChatInput (UI only first)
9. Scaffold FastAPI backend
10. Set up Supabase — create all tables from TECHSTACK.md schema
11. Set up rate limiting with SlowAPI
12. Build /chat endpoint with Claude API integration and caching
13. Connect frontend chat to backend
14. Build /topics endpoints
15. Build CategoryGrid and TopicList components
16. Build TopicExplanation with Claude API + caching + translation
17. Set up i18next translations — wire language switcher
18. Build location detection hook
19. Build /local endpoint + seed Seattle/Bellevue data
20. Build GetInvolved page with local data
21. Set up Supabase Auth
22. Add user progress tracking
23. Polish animations, fix bugs, deploy

## Rules for Writing Code
- Always use TypeScript, never plain JS
- Always use Pydantic models in FastAPI
- Never hardcode API keys
- Always check cache before calling Claude API
- Every component gets its own file
- Handle loading and error states always
- Never skip rate limiting on AI endpoints
- Commit to git after every working feature
- Keep components small — one responsibility per file
