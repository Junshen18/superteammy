# Superteam Malaysia Website

The official website for Superteam Malaysia — the home for Solana builders in Malaysia. A modern Web3 community hub that showcases our community, events, members, and opportunities.

## Overview

Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem. This website serves as the digital headquarters for our community.

### Key Features

- **Landing Page** — Hero with animated logo, Who We Are, Mission (Learn/Build/Grow/Earn), Stats, Events, Members Spotlight, Partners, Wall of Love, FAQ
- **Members Directory** (`/members`) — Search, skill-based filtering, flip-style member cards with badges (Bounty Hunter, Solana Builder, Hackathon Winner, Core Contributor)
- **Member Dashboard** (`/dashboard`) — Overview, Profile, Projects, Perks (claim member benefits)
- **Admin Dashboard** — Members, Events, Partners, Perks, Site Content, Invites (role-based: super_admin, admin)
- **Luma Integration** — Event sync, ICS support
- **Invite Flow** — Token-based invite redemption (`/invite/[token]`)
- **Onboarding** — Onboarding flow for new members
- **Smooth Scroll** — Lenis + GSAP scroll animations
- **Loading Screen** — Animated loading experience
- **SEO** — Metadata, sitemap, structured data

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Component library (Radix primitives) |
| **Framer Motion** | Scroll and interaction animations |
| **GSAP** | Advanced scroll-triggered animations |
| **Lenis** | Smooth scrolling |
| **Supabase** | PostgreSQL, Auth, Storage |
| **Lucide React** | Icon system |
| **react-tweet** | Twitter/X embed support |
| **react-intersection-observer** | Scroll-triggered animations |
| **next-sitemap** | SEO sitemap generation |
| **react-hook-form + zod** | Forms and validation |

## Project Structure

```
src/
├── app/
│   ├── (site)/                    # Main site
│   │   ├── layout.tsx             # Navbar + AppShell + Footer
│   │   ├── page.tsx               # Landing page
│   │   └── members/
│   │       ├── layout.tsx
│   │       └── page.tsx           # Members directory
│   ├── dashboard/                 # Member + Admin dashboard
│   │   ├── layout.tsx            # Auth, sidebar, role-based nav
│   │   ├── page.tsx              # Overview
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── perks/                # Member perks (claim)
│   │   ├── members/              # Admin: members CRUD
│   │   ├── events/               # Admin: events CRUD
│   │   ├── partners/             # Admin: partners CRUD
│   │   ├── manage-perks/         # Admin: perks CRUD
│   │   ├── content/              # Admin: site content
│   │   └── invites/              # Admin: invite management
│   ├── admin/                    # Admin client components
│   │   ├── members/AdminMembersClient.tsx
│   │   ├── events/AdminEventsClient.tsx
│   │   ├── partners/AdminPartnersClient.tsx
│   │   ├── perks/AdminPerksClient.tsx
│   │   ├── content/AdminContentClient.tsx
│   │   └── invites/AdminInvitesClient.tsx
│   ├── onboarding/
│   ├── invite/[token]/           # Invite redemption
│   ├── api/                     # API routes (invites, sync-luma, admin)
│   └── layout.tsx               # Root layout, fonts
├── components/
│   ├── layout/                  # Navbar, Footer, AppShell, ConditionalFooter
│   ├── landing/                 # HeroSection, WhoWeAreSection, MissionSection, etc.
│   ├── members/                 # MemberProfileCard, MemberFilters, ProfileCard
│   └── ui/                      # SectionHeading, Badge, Accordion, LoadingScreen, etc.
├── contexts/                    # LoadingContext, LenisContext, HeroLogoRefContext
├── hooks/                       # useScrambleText
├── lib/
│   ├── supabase/                # client, server, queries
│   ├── types.ts
│   ├── data.ts                  # Sample data for dev/seed
│   ├── luma.ts
│   ├── luma-ics.ts
│   └── luma-sync.ts
└── middleware.ts                # Auth, admin route protection

supabase/
├── schema.sql                   # Base schema (legacy)
└── migrations/
    ├── 20250304000000_add_luma_event_id.sql
    ├── 20250305000000_add_is_archived_to_events.sql
    ├── 20250306000000_member_management.sql
    ├── 20250307000000_partner_logos_bucket.sql
    ├── 20250310000000_add_member_number.sql
    ├── 20250310000001_auto_assign_member_number.sql
    ├── 20250310000002_add_member_badges.sql
    └── 20250312000000_add_perks.sql
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm
- Supabase project (required for full functionality)

### Installation

```bash
git clone <your-repo-url>
cd superteammy

npm install
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Luma API (optional, for event sync)
LUMA_API_KEY=your-luma-api-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Supabase Setup

#### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note your **Project Reference ID** (Settings → General → Reference ID)

#### 2. Apply Migrations

**Option A: Supabase CLI (recommended)**

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

**Option B: Manual SQL**

1. For a **fresh project**, run `supabase/schema.sql` first
2. In Supabase → SQL Editor, run each migration in order (by timestamp)

#### 3. Seed Data (optional)

```bash
npm run seed
```

#### Troubleshooting

| Error | Solution |
|-------|----------|
| `Access token not provided` | Run `npx supabase login` |
| `parse error near '\n'` | Don't use `<>` in project-ref; use ID directly |
| `policy/trigger/type already exists` | Re-run `npx supabase db push` (migrations use `DROP IF EXISTS`) |

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Pages

### Landing Page (`/`)

1. **Hero** — Animated logo, gradient headline, CTAs
2. **Who We Are** — Scroll-reveal text
3. **Mission** — 4 pillars (Learn, Build, Grow, Earn) with images
4. **Stats** — Animated counters
5. **Events** — Upcoming & past events (Luma)
6. **Members Spotlight** — Featured member cards (marquee-style)
7. **Partners** — Logo grid
8. **Wall of Love** — Testimonials
9. **FAQ** — Accordion

### Members Page (`/members`)

- Search by name, role, company
- Filter by skills (from Supabase)
- Member cards with flip interaction, badges, social links
- Expandable overlay for full profile

### Dashboard (`/dashboard`)

**Member routes**

- Overview — Quick stats, links
- My Profile — Edit profile
- Projects — Proof of work
- Perks — Claim member perks (ETHGlobal-style layout)

**Admin routes** (super_admin / admin)

- Members — Manage profiles
- Events — CRUD events
- Partners — Manage logos
- Perks — Add/edit perks
- Site Content — Edit landing copy
- Invites — Super admin only

### Invite Flow (`/invite/[token]`)

Token-based invite redemption for new members.

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#080B0E` | Page background |
| Solana Purple | `#9945FF` | Primary accent |
| Solana Green | `#14F195` | Secondary accent |
| Gold | `#F0C040` | Achievement highlights |
| Muted | `#A0A0B0` | Secondary text |

### Typography

- **Sans**: Archivo
- **Display**: Orbitron

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Or connect your repo to [Vercel](https://vercel.com). Add all env vars from `.env.example`.

## CMS Architecture

- **Supabase** — Database, Auth, Storage
- **Dashboard** — `/dashboard` for content management
- **Roles** — `super_admin`, `admin`, `member` (via Supabase Auth + profiles)
- **Storage buckets** — `avatars`, `partner-logos`, `event-covers`, `perk-icons`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is built for the Superteam Malaysia community.

## Acknowledgments

- [Superteam Global](https://superteam.fun)
- [Solana Foundation](https://solana.com)
- [Superteam UAE](https://uae.superteam.fun)
- [Superteam Germany](https://de.superteam.fun)
- [ETHGlobal Packs](https://ethglobal.com/packs/builder) — Perks layout inspiration
