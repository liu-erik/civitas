# Civitas — Product Requirements Document

## The Problem
Immigrant communities in the U.S. — particularly middle-aged and elderly immigrants with limited English — are effectively shut out of civic life. Government websites are dense, written in legalese, and available only in English. The result: millions of people who have lived here for decades still don't know their rights, don't understand how local government works, and don't know how to get involved.

This isn't a lack of interest. It's a lack of accessible information.

Real example: An elderly Chinese immigrant who has lived in the U.S. for 15 years speaks no English. She has never voted, doesn't know her rights during a police stop, and has no idea how to contact her city council representative — not because she doesn't care, but because every resource available assumes English fluency and civic familiarity she doesn't have.

## The Solution
Civitas is a civic education web app that meets immigrants where they are. It combines an AI-powered civic assistant with a structured topic browser — all in the user's native language. Users can ask civic questions conversationally, browse topics by category, discover local representatives and community organizations, and learn how to take concrete action in their community.

## Target User
- Middle-aged to elderly immigrants
- Limited or no English proficiency
- New or long-term residents — doesn't matter
- Feels overwhelmed and excluded by existing civic resources
- Not necessarily tech-savvy — needs simplicity above all else
- Primary languages: Spanish, Mandarin (app supports all languages)

## Core User Needs (in priority order)
1. **How to get involved** — voting, contacting representatives, joining local organizations, attending community events
2. **Know your rights** — especially during police interactions, but all major rights
3. **Understand current politics** — learn about political issues and form their own opinions

## Product Overview

### Home Screen — AI Civic Assistant
- Finexa-style layout: greeting, AI orb, suggested questions, chat input at bottom
- Greeting personalized by time of day and user's name (if logged in)
- 6 suggested civic questions displayed as clickable chips (e.g. "What are my rights during a police stop?", "How do I register to vote in Seattle?", "Who is my city council representative?")
- User can type any civic question in their language
- AI responds conversationally in the user's selected language
- Responses include: plain language explanation + relevant article links with brief summaries in user's language
- Location-aware: answers reference local context (Seattle, Bellevue, etc.) when relevant

### Top Navigation
- Pill-shaped nav items: Home, Topics, Rights, Get Involved, Politics
- Language selector always visible in top right
- Settings icon for preferences
- User avatar/login button top right
- Modern, sleek — opposite of clustered

### Topic Browser
- Structured taxonomy of civic topics stored in PostgreSQL
- Categories: Voting, Immigration Law, Local Government, Rights & Protections, How to Get Involved, Current Issues
- Each category → subcategories → individual topics
- Click a topic → AI-generated plain language explanation (cached in DB after first generation)
- Explanation structure: What it is | Why it matters | What you can do
- All content served in user's selected language

### Civic Taxonomy (MVP)
**Voting**
- How to register to vote
- Who is eligible to vote
- How elections work
- Mail-in voting
- Upcoming local elections

**Rights & Protections**
- Rights during police interactions
- Tenant rights
- Workers rights
- Right to not be discriminated against
- Immigration rights

**Local Government**
- How city council works
- How to attend a public meeting
- How to contact your representative
- What your mayor/council member actually does

**How to Get Involved**
- How to register to vote (action steps)
- How to contact your representative (templates)
- Local community organizations near you
- Upcoming civic events in your city
- How to attend city council meetings

**Current Political Issues**
- Overview of major current issues
- Different perspectives explained neutrally
- How each issue affects immigrant communities specifically

### Location Features (City Level)
- Auto-detect user's city from browser
- Show local representatives (name, photo, what they stand for, contact info)
- Show upcoming local elections and events
- Show local community organizations relevant to immigrants
- All location data stored and updated in PostgreSQL

### Language Support
- Language selector on every page — changes ALL text (headers, nav, content, AI responses)
- Primary: Spanish, Mandarin (Simplified)
- Extended: All major languages via Claude API translation
- User's language preference saved to account or localStorage
- Cached translations stored in DB to avoid regenerating

### User Accounts (Optional)
- Sign up / log in via Supabase Auth
- Saves: language preference, location, topics viewed, bookmarked topics
- Progress tracking: topics read per category
- Works fully without account — account just enables saving

## What Makes This Not a GPT Wrapper
1. **Structured taxonomy in PostgreSQL** — civic knowledge is organized by humans into a real data model, not just prompted freeform
2. **Cached AI responses** — explanations are generated once and stored, not regenerated every request
3. **Location layer** — real data about local representatives, organizations, and events stored in DB
4. **Multilingual storage** — translations cached in DB per language per topic
5. **User progress tracking** — real database queries tracking what each user has read

## Post-Demo Features (V2)
- Attorney practitioner view — share resources with clients, see engagement
- Quiz/learning mode with progress gamification
- Push notifications for upcoming local elections/events
- Community forum — immigrants help each other
- Mobile app (React Native)

## Success Metrics
- Attorney Cao uses it with at least 3 clients
- App works fully in Spanish and Mandarin at demo
- User can find answer to any of the 6 suggested questions in under 2 minutes
- All content readable at 8th grade level
