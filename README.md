Civitas

A multilingual civic AI platform that answers location-specific public service questions in English, Spanish, and Mandarin.

About

Basic civic tasks — renewing an ID, reporting a pothole, finding local representatives — often require digging through a dozen different city and county websites, and that gets even harder without fluent English. Civitas was built to fix that: a single platform where users can ask a public service question in their own language and get an accurate, location-grounded answer.

Built with the immigrant community in mind, including my own grandparents, who shouldn't need to navigate a maze of government websites just to find a straight answer.

Features
Multilingual support — ask and receive answers in English, Spanish, or Mandarin
Location-aware answers — responses are grounded to the user's specific city/county rather than generic, using a structured knowledge taxonomy across 30+ civic topics
AI-powered Q&A — natural language questions are answered using an LLM, constrained to curated, verified civic content rather than free-form generation
Cost-optimized caching — a PostgreSQL caching layer stores AI responses per query, cutting redundant API calls and reducing AI API costs by ~30%
Tech Stack
Frontend: React
Backend: FastAPI
Database: PostgreSQL, Supabase
Deployment: Vercel (frontend), Railway (backend)
Architecture
User Query (React frontend)
        ↓
FastAPI Backend
        ↓
Knowledge Taxonomy Lookup (30+ civic topics, location-scoped)
        ↓
Cache Check (PostgreSQL) → if cached, return stored response
        ↓ (if not cached)
LLM Response Generation (grounded to taxonomy content)
        ↓
Store response in cache → Return to user

The AI layer handles language flexibility and natural phrasing across all three supported languages, while the structured taxonomy anchors factual accuracy — keeping the system from relying on an LLM's own (often outdated or hallucinated) knowledge of local civic procedures.


Note: use the service role key on the backend, not the anon key — the anon key is scoped for frontend use and doesn't have permission to bypass row-level security.

Run the backend
bash
   uvicorn main:app --reload
Run the frontend
bash
   npm run dev
Roadmap
Expand language coverage beyond English, Spanish, and Mandarin
Deepen content coverage across additional civic topics
Improve location precision (city-level → neighborhood-level where relevant)
License

MIT

Built by Erik Liu
