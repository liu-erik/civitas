# Civitas — Design Document

## Design Philosophy
Clean, minimal, and trustworthy. Lots of white space. Content breathes. Nothing feels cluttered or overwhelming. The design should make an elderly immigrant who has never used a civic resource feel calm and capable — not intimidated. Think Linear or Notion, not a government website.

## Color System

### Primary — Blue
- Primary: `#3B82F6` (blue-500)
- Light: `#EFF6FF` (blue-50) — backgrounds, subtle fills
- Medium: `#93C5FD` (blue-300) — hover states, borders
- Dark: `#1D4ED8` (blue-700) — pressed states, emphasis
- Use for: navigation, interactive elements, links, primary buttons, AI elements

### Secondary — Green
- Primary: `#10B981` (emerald-500)
- Light: `#ECFDF5` (emerald-50) — backgrounds, subtle fills
- Medium: `#6EE7B7` (emerald-300) — hover states, borders
- Dark: `#047857` (emerald-700) — pressed states, emphasis
- Use for: success states, action steps, progress indicators, "get involved" sections, positive feedback

### Neutrals
- Background: `#FFFFFF`
- Surface: `#F9FAFB` (gray-50) — page background
- Card: `#FFFFFF` — card background
- Border: `#E5E7EB` (gray-200) — subtle borders
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#6B7280` (gray-500)
- Text Hint: `#9CA3AF` (gray-400)

### Semantic
- Info: blue primary
- Success: green primary
- Warning: `#F59E0B` (amber-500)
- Error: `#EF4444` (red-500)

## Typography

### Font
- Primary: **Inter** — clean, highly legible, excellent multilingual support
- Fallback: system-ui, sans-serif

### Scale
- Display: 36px / 700 weight — hero headings
- H1: 30px / 600 weight — page titles
- H2: 24px / 600 weight — section titles
- H3: 20px / 500 weight — card titles
- Body Large: 18px / 400 weight — primary reading text (larger for accessibility)
- Body: 16px / 400 weight — standard text
- Small: 14px / 400 weight — captions, labels
- Tiny: 12px / 400 weight — hints, timestamps

### Rules
- Line height: 1.7 for body text (generous for readability)
- Never go below 14px for any visible text
- Multilingual text must render correctly — Inter supports Latin, Chinese, Arabic, Cyrillic, Vietnamese

## Spacing System
- 4px base unit
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Page padding: 24px mobile, 48px desktop
- Card padding: 24px
- Section gap: 48px
- Component gap: 16px

## Border Radius
- Small: 8px — inputs, badges, chips
- Medium: 12px — cards, buttons
- Large: 16px — modals, large cards
- Full: 9999px — pill nav items, tags, avatars

## Shadows
- Subtle (inner cards, secondary): `0 1px 3px rgba(0,0,0,0.08)`
- Default (main cards): `0 4px 12px rgba(0,0,0,0.08)`
- Elevated (modals, dropdowns): `0 8px 24px rgba(0,0,0,0.12)`
- Never use heavy drop shadows — keeps it clean and minimal

## Components

### Navigation Bar
- White background, bottom border `#E5E7EB`
- Left: Civitas logo (globe icon + wordmark in blue)
- Center: Pill-shaped nav items — Home, Topics, Rights, Get Involved, Politics
  - Default: transparent background, gray text
  - Active: blue-50 background, blue text, blue border
  - Hover: gray-50 background
- Right: Language selector + Settings icon + User avatar/Login button
- Height: 64px
- Sticky — stays at top on scroll

### Pill Nav Items
- Padding: 8px 16px
- Border radius: 9999px
- Font: 14px / 500 weight
- Transition: background 150ms ease

### AI Globe (Home Screen)
- Centered globe SVG/Lottie animation
- Colors: blue-to-green gradient
- Subtle continuous rotation animation (slow, 20s loop)
- Subtle pulse glow on idle
- When processing a question: faster pulse, slight scale up
- Size: 80px

### Home Screen Layout
- Page background: gray-50
- Centered content, max-width 720px
- Top: Globe animation
- Below: Greeting text — "Good Morning" / personalized if logged in
- Below: "How can Civitas help you today?" in blue
- Below: Suggested questions card (white, default shadow, border radius large)
  - 6 question chips in 2 rows of 3
  - Each chip: white bg, gray border, icon + text, hover turns blue-50
- Bottom: Fixed chat input bar
  - White background, border-top gray-200
  - Input: full width, placeholder in user's language
  - Send button: blue, circle, arrow icon

### Cards
- Background: white
- Border: 1px solid `#E5E7EB`
- Border radius: 12px
- Shadow: default
- Padding: 24px
- Hover (if clickable): shadow elevates, border turns blue-200, transition 150ms

### Topic Browser
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- Category cards with icon, title, subtitle, topic count
- Blue icon for civic/voting topics
- Green icon for action/involvement topics
- Click category → subcategory list slides in from right
- Click topic → full explanation panel slides in

### Page Transitions
- All page/route transitions: slide in from right (new page) / slide out to left (old page)
- Duration: 250ms
- Easing: ease-in-out
- Use Framer Motion `AnimatePresence` with `initial`, `animate`, `exit`
- Tab switches within a page: fade in/out, 150ms

### Buttons
- Primary: blue background, white text, 12px radius, 40px height
  - Hover: blue-700
  - Active: scale(0.98)
- Secondary: white background, blue border, blue text
  - Hover: blue-50 background
- Success/Action: green background, white text (for "Get Involved" CTAs)
- Ghost: transparent, gray text, no border
  - Hover: gray-50 background

### Language Selector
- Dropdown in top right nav
- Shows current language flag + name
- Opens dropdown with all available languages
- Search input at top of dropdown for filtering
- Selecting language: instantly changes ALL text on page

### Chat Response Cards
- White card with default shadow
- Blue left border accent (3px)
- AI response text in body size
- Below text: article links as chips (icon + title + source)
- Each link chip: hover turns blue-50, opens in new tab

### Local Info Cards (Get Involved)
- Representative cards: avatar, name, title, party indicator, contact button (green)
- Event cards: date badge (blue), event name, location, RSVP button (green)
- Organization cards: logo, name, description, website button

### Progress Indicators
- Topic read: green checkmark on topic card
- Category progress: green progress bar at top of category
- Overall: circular progress in user profile

## Iconography
- Library: Lucide React — consistent, clean, minimal
- Size: 20px default, 16px small, 24px large
- Color: inherits from context (blue for nav, green for actions, gray for neutral)

## Responsive Breakpoints
- Mobile: 0–768px
- Tablet: 768–1024px
- Desktop: 1024px+
- Design mobile-first — elderly users may use tablets

## Accessibility
- Minimum contrast ratio: 4.5:1 for all text
- Focus rings on all interactive elements (blue outline)
- All images have alt text in user's language
- Font size never below 14px
- Touch targets minimum 44x44px (important for elderly users)

## Animation Principles
- All animations: purposeful, not decorative
- Duration: 150ms micro, 250ms transitions, 400ms entrances
- Easing: ease-in-out for transitions, ease-out for entrances
- Never animate more than 2 properties simultaneously
- Respect prefers-reduced-motion — disable animations if user has it enabled
- Page transitions: slide right on navigate forward, slide left on navigate back
- Component entrances: fade + slight upward translate (y: 8px → 0)
