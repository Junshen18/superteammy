# Superteam Malaysia Website

The official website for Superteam Malaysia — the home for Solana builders in Malaysia. A modern Web3 community hub that showcases our community, events, members, and opportunities.

## Overview

Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem. This website serves as the digital headquarters for our community.

### Key Features

- **Landing Page** with 10 distinct sections (Hero, Mission, Stats, Events, Members Spotlight, Partners, Wall of Love, FAQ, CTA, Footer)
- **Members Directory** with search, skill-based filtering, and animated member cards
- **Admin Dashboard** for managing all content (Members, Events, Partners, Site Content)
- **Luma Integration** for event management
- **Responsive Design** optimized for desktop, tablet, and mobile
- **Scroll Animations** powered by Framer Motion
- **SEO Optimized** with metadata, sitemap, and structured data

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Scroll and interaction animations |
| **Supabase** | PostgreSQL database, Auth, Storage |
| **Lucide React** | Icon system |
| **react-tweet** | Twitter/X embed support |
| **react-intersection-observer** | Scroll-triggered animations |
| **next-sitemap** | SEO sitemap generation |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Landing page (10 sections)
│   ├── members/
│   │   ├── layout.tsx      # Members page metadata
│   │   └── page.tsx        # Members directory with search/filter
│   └── admin/
│       ├── layout.tsx      # Admin layout with sidebar & auth
│       ├── page.tsx        # Admin dashboard
│       ├── members/        # CRUD for members
│       ├── events/         # CRUD for events
│       ├── partners/       # CRUD for partners
│       └── content/        # Edit site content
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── landing/            # All landing page sections
│   ├── members/            # MemberCard, MemberFilters
│   └── ui/                 # SectionHeading, AnimatedCounter, Badge, Accordion
├── lib/
│   ├── supabase/           # Supabase client & server utilities
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Sample/seed data
│   └── luma.ts             # Luma API integration
└── middleware.ts            # Security headers for admin routes

supabase/
└── schema.sql              # Full database schema with RLS & seed data
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm
- A Supabase project (optional for local development)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd superteammy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Luma API (optional)
LUMA_API_KEY=your-luma-api-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: The site works with sample data out of the box. Supabase credentials are only required for production use with the CMS.

### Database Setup (Optional)

If using Supabase:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Run the contents of `supabase/schema.sql`
4. Update your `.env.local` with the project credentials

### Local Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Pages

### Landing Page (`/`)

A full-featured landing page with 10 sections:

1. **Hero** — Bold gradient headline, CTAs, animated background
2. **Mission** — 6 pillar cards (Builder Support, Events, Grants, Jobs, Education, Network)
3. **Stats** — Animated counters for community metrics
4. **Events** — Upcoming & past events with Luma integration
5. **Members Spotlight** — Featured member cards with achievements
6. **Partners** — Logo grid of ecosystem partners
7. **Wall of Love** — Community testimonials
8. **FAQ** — Expandable accordion
9. **Join CTA** — Strong call-to-action with social links
10. **Footer** — Navigation, social links, branding

### Members Page (`/members`)

- Search by name, role, or company
- Filter by skill tags (Core Team, Rust, Frontend, Design, Content, Growth, Product, Community)
- Member cards with achievements, skill badges, and Twitter/X links
- Responsive grid (4→2→1 columns)

### Admin Dashboard (`/admin`)

- Protected by Supabase Auth
- **Members Management** — Add, edit, delete member profiles
- **Events Management** — Create and manage events
- **Partners Management** — Manage partner logos and links
- **Content Editor** — Edit landing page text content

## Design System

### Color Palette

| Color | Hex | Usage |
|---|---|---|
| Solana Purple | `#9945FF` | Primary accent, CTAs |
| Solana Green | `#14F195` | Secondary accent, icons |
| Background | `#0A0A1A` | Page background |
| Surface | `#1A1A2E` | Card backgrounds |
| Muted | `#A0A0B0` | Secondary text |
| Gold | `#F0C040` | Achievement highlights |

### Typography

- **Headings**: Space Grotesk (bold, modern Web3 feel)
- **Body**: Inter (clean readability)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

### Environment Variables on Vercel

Add all variables from `.env.example` to your Vercel project settings.

## CMS Architecture

The website uses a lightweight CMS architecture:

- **Supabase** as the backend database
- **Admin Dashboard** at `/admin` for content management
- **Role-based access** via Supabase Auth
- **Sample data** included for development without Supabase

Admins can:
- Add, edit, and delete member profiles
- Manage events with Luma URLs
- Update partner logos and ecosystem projects
- Edit landing page content (titles, descriptions, CTAs)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is built for the Superteam Malaysia community.

## Acknowledgments

- [Superteam Global](https://superteam.fun) — The global Superteam network
- [Solana Foundation](https://solana.com) — The Solana ecosystem
- [Superteam UAE](https://uae.superteam.fun) — Design inspiration
- [Superteam Germany](https://de.superteam.fun) — Design inspiration
