# Civitas — Tech Stack Document

## Overview
Every technology choice is made with three goals: junior-level explainability, real industry standards, and cost efficiency. Every piece of this stack is used at real companies and can be defended in a Big Tech SWE interview.

## Frontend

### React (Vite)
- **What**: JavaScript UI library for building component-based web apps
- **Why**: Industry standard, what most SWE interviews expect, same as JustifAI
- **Version**: Latest stable via Vite scaffold
- **Command**: `npm create vite@latest frontend -- --template react-ts`

### TypeScript
- **What**: JavaScript with type safety
- **Why**: Catches bugs before runtime, expected at Big Tech, makes code more readable
- **Rule**: All frontend code is TypeScript, never plain JS

### Tailwind CSS (v3)
- **What**: Utility-first CSS framework
- **Why**: Fast styling, consistent design system, industry standard
- **Version**: v3 (not v4 — more stable)

### shadcn/ui
- **What**: Pre-built React component library built on Tailwind
- **Why**: Professional look out of the box, used at real companies, saves days of styling work
- **Components used**: Button, Card, Input, Dialog, DropdownMenu, Avatar, Progress, Badge

### Framer Motion
- **What**: Animation library for React
- **Why**: Powers all page transitions and component entrance animations
- **Key usage**: AnimatePresence for page transitions, motion.div for component animations

### React Router v6
- **What**: Client-side routing for React
- **Why**: Handles navigation between pages, enables page transition animations
- **Routes**: /, /topics, /topics/:category, /topics/:category/:topic, /rights, /get-involved, /politics, /settings

### i18next + react-i18next
- **What**: Internationalization library
- **Why**: Handles all static UI text translation (nav, buttons, labels) for free
- **How**: JSON translation files per language, instant switch on language change
- **Languages pre-translated**: English, Spanish, Mandarin (Simplified)
- **Other languages**: Fallback to English for UI, Claude handles content translation

### Axios
- **What**: HTTP client for API calls
- **Why**: Cleaner than fetch, better error handling, easy to add auth headers globally

## Backend

### FastAPI (Python)
- **What**: Modern Python web framework for building APIs
- **Why**: Fast, clean, automatic API documentation, same as JustifAI
- **Version**: Latest stable
- **Entry point**: `backend/main.py`
- **Run**: `uvicorn main:app --reload`

### Python 3.11+
- **What**: Programming language for backend
- **Why**: Excellent AI/ML ecosystem, clean syntax, widely used

### Pydantic
- **What**: Data validation library (built into FastAPI)
- **Why**: Validates all incoming request data, prevents bad data from reaching the database
- **Rule**: Every API request and response has a Pydantic model

### SlowAPI (Rate Limiting)
- **What**: Rate limiting library for FastAPI
- **Why**: Prevents API abuse, protects Claude API credits from being drained
- **Rules**:
  - AI chat endpoint: 10 requests per minute per IP
  - Topic explanation endpoint: 20 requests per minute per IP
  - Auth endpoints: 5 requests per minute per IP
  - General API: 100 requests per minute per IP
- **Implementation**: Decorator-based, 5 lines of code per endpoint

### Python-dotenv
- **What**: Loads environment variables from .env file
- **Why**: Keeps API keys out of code, security best practice

## Database

### Supabase (PostgreSQL)
- **What**: Hosted PostgreSQL database with built-in auth and storage
- **Why**: Real PostgreSQL under the hood (interview-worthy), free tier, easy setup
- **Cost**: Free tier covers demo and early users

### Database Schema

#### languages
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
code VARCHAR(10) UNIQUE NOT NULL  -- 'en', 'es', 'zh'
name VARCHAR(50) NOT NULL         -- 'English', 'Español', '中文'
created_at TIMESTAMP DEFAULT NOW()
```

#### categories
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug VARCHAR(50) UNIQUE NOT NULL  -- 'voting', 'rights'
icon VARCHAR(50)                  -- lucide icon name
color VARCHAR(20)                 -- 'blue' or 'green'
order_index INTEGER
created_at TIMESTAMP DEFAULT NOW()
```

#### category_translations
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
category_id UUID REFERENCES categories(id)
language_code VARCHAR(10)
name VARCHAR(100) NOT NULL
description TEXT
```

#### topics
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
category_id UUID REFERENCES categories(id)
slug VARCHAR(100) UNIQUE NOT NULL
order_index INTEGER
created_at TIMESTAMP DEFAULT NOW()
```

#### topic_translations
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
topic_id UUID REFERENCES topics(id)
language_code VARCHAR(10)
title VARCHAR(200) NOT NULL
what_it_is TEXT          -- cached AI explanation
why_it_matters TEXT      -- cached AI explanation
what_you_can_do TEXT     -- cached AI explanation
generated_at TIMESTAMP
```

#### chat_cache
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
question_hash VARCHAR(64) UNIQUE  -- MD5 hash of question + language
question TEXT NOT NULL
language_code VARCHAR(10)
response TEXT NOT NULL
sources JSONB                      -- array of {title, url, summary}
created_at TIMESTAMP DEFAULT NOW()
```

#### local_data (seeded manually for Seattle/Bellevue)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
type VARCHAR(50)          -- 'representative', 'organization', 'event'
city VARCHAR(100)
state VARCHAR(50)
data JSONB                -- flexible JSON for different types
active BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
```

#### user_progress
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES auth.users(id)
topic_id UUID REFERENCES topics(id)
read_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, topic_id)
```

#### bookmarks
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES auth.users(id)
topic_id UUID REFERENCES topics(id)
created_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, topic_id)
```

## Authentication

### Supabase Auth
- **What**: Built-in auth system from Supabase
- **Why**: Free, handles email/password and OAuth, integrates with PostgreSQL via Row Level Security
- **Flow**: Email + password signup/login, JWT tokens, auto-refresh
- **Optional**: App works fully without account, auth just enables saving preferences

### Row Level Security (RLS)
- **What**: PostgreSQL feature that restricts which rows users can see
- **Why**: Users can only read/write their own progress and bookmarks
- **Rule**: Enable RLS on user_progress and bookmarks tables

## AI Layer

### Anthropic Claude API
- **What**: AI model for generating civic explanations and translating content
- **Why**: Best in class for structured output, streaming, and following instructions precisely
- **Model**: claude-sonnet-4-20250514
- **Usage**:
  1. Generate civic topic explanations (English, cached after first generation)
  2. Translate explanations to user's language (cached per language)
  3. Answer freeform civic questions in chat (cached by question hash)

### Caching Strategy (Cost Control)
- Every AI response is cached in the database
- Cache key for chat: MD5 hash of (question + language_code)
- Cache key for topics: topic_id + language_code
- Cache hit → serve from DB instantly, no API call
- Cache miss → call Claude → store in DB → serve
- Estimated cost: $5-10 for full development and demo

## Location

### Browser Geolocation API
- **What**: Built-in browser API, completely free
- **Why**: Gets user's coordinates without any third-party service
- **Flow**: Ask permission → get lat/lng → reverse geocode to city

### OpenCage Geocoding API (Free Tier)
- **What**: Converts coordinates to city/state name
- **Why**: Free tier (2,500 requests/day), reliable
- **Alternative**: Use IP-based location as fallback if user denies geolocation

### Local Data Strategy
- Representatives, organizations, events manually seeded in `local_data` table
- Seed data covers: Seattle, Bellevue, Redmond, Kirkland, Tacoma
- Data includes: city council members, immigrant community organizations, upcoming civic events
- Update manually as needed

## Security

### Environment Variables
- Never hardcode API keys in code
- All secrets in `.env` files
- `.env` always in `.gitignore`
- Frontend: `VITE_` prefix for public vars, never put secret keys in frontend

### CORS
- Backend only accepts requests from frontend origin
- Development: `http://localhost:5173`
- Production: your Vercel domain
- Never use `allow_origins=["*"]` in production

### Rate Limiting (SlowAPI)
- Chat endpoint: 10 req/min per IP
- Topic endpoint: 20 req/min per IP
- Auth endpoints: 5 req/min per IP
- Returns 429 Too Many Requests with retry-after header

### Input Validation
- All user input validated with Pydantic before processing
- Max question length: 500 characters
- Strip HTML tags from all user input
- Sanitize before storing in database

### SQL Injection Prevention
- Never write raw SQL with string concatenation
- Always use Supabase client parameterized queries
- Pydantic validates types before any DB operation

### JWT Security
- Supabase handles JWT generation and validation
- Tokens expire after 1 hour, auto-refresh
- Never store JWT in localStorage — use httpOnly cookies or Supabase's built-in session management

### API Key Protection
- Claude API key: backend only, never exposed to frontend
- Supabase anon key: frontend safe (RLS enforces access control)
- Supabase service key: backend only, never in frontend

## Deployment

### Frontend — Vercel
- **Cost**: Free
- **Deploy**: Connect GitHub repo, auto-deploys on push to main
- **Env vars**: Set in Vercel dashboard

### Backend — Railway
- **Cost**: ~$5/month hobby plan
- **Deploy**: Connect GitHub repo, auto-deploys on push to main
- **Env vars**: Set in Railway dashboard
- **Run command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Developer Workflow

### Git Strategy
- `main` branch: always working, production-ready
- Feature branches: `feature/topic-browser`, `feature/chat`, etc.
- Commit after every working feature — enables rollback if AI breaks something
- Pull requests for all changes — use CodeRabbit for automated code review

### CodeRabbit
- AI code reviewer that catches bugs before merge
- Install on GitHub repo
- Reviews every pull request automatically
- Free for public repos

### Local Development
- Frontend: `cd frontend && npm run dev` → localhost:5173
- Backend: `cd backend && venv\Scripts\activate && uvicorn main:app --reload` → localhost:8000
- Both must run simultaneously

## File Structure
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
        cache.ts
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
      cors.py
    seeds/
      categories.py
      local_data.py
    .env
```
