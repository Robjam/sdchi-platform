# SDCHI.JP Landing Page

A modern, responsive landing page built with Nuxt 4, Tailwind CSS, and Cloudflare D1 database for email signup collection.

## Features

- 🎨 Beautiful gradient landing page design
- 📧 Email signup form with optional name field
- 🤖 Bot detection using canary field strategy
- 📱 Fully responsive design
- ⚡ Powered by Nuxt 4 and Tailwind CSS
- 🗄️ Cloudflare D1 database integration with Drizzle ORM
- 🚀 Ready for Cloudflare Pages deployment

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

### 3. Database Setup

First, create a D1 database in Cloudflare:

```bash
# Create the D1 database
wrangler d1 create sdchi-signups

# Copy the database ID from the output and update wrangler.toml
```

Update the `database_id` fields in `wrangler.toml` with your database ID.

### 4. Run Database Migration

```bash
# Apply migration to D1 database
wrangler d1 execute sdchi-signups --local --file=./drizzle/migrations/0000_great_warlock.sql
```

### 5. Development

```bash
# Start development server
pnpm dev
```

The landing page will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm wrangler:dev` - Start Wrangler development
- `pnpm cf:deploy` - Deploy to Cloudflare Pages

## Project Structure

```
├── app/
│   └── app.vue                    # Landing page component
├── server/
│   └── api/
│       └── signup.post.ts         # Signup API endpoint
├── drizzle/
│   ├── schema.ts                  # Database schema
│   └── migrations/                # Database migrations
├── utils/
│   └── database.ts                # D1 connection utility
├── drizzle.config.ts              # Drizzle configuration
├── wrangler.toml                  # Cloudflare configuration
├── nuxt.config.ts                 # Nuxt configuration
└── .env.example                   # Environment variables template
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set up environment variables in Cloudflare dashboard
3. Configure D1 database binding
4. Deploy!

### Database Migration in Production

```bash
# Apply migrations to production database
wrangler d1 execute sdchi-signups --env=production --file=./drizzle/migrations/0000_great_warlock.sql
```

## Features

### Landing Page
- Modern gradient design with glass morphism effects
- Responsive layout for all devices
- SEO optimized with meta tags
- Smooth animations and hover effects

### Email Signup
- Email validation (client and server-side)
- Optional name field
- Bot detection using hidden canary field
- Real-time form feedback
- Success/error message display

### Database Schema
- `signups` table with email uniqueness constraint
- Bot detection tracking
- Timestamp tracking
- Type-safe with Drizzle ORM

### Security
- Input validation with Zod
- Hidden canary field for bot detection
- Email uniqueness enforcement
- Proper error handling

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, Tailwind CSS
- **Backend**: Nitro (Nuxt server)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Deployment**: Cloudflare Pages
- **Validation**: Zod
