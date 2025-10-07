# Comprehensive Landing Page Implementation Plan for sdchi.jp

## Overview
Transform the existing Nuxt 4 project into a landing page with email signup functionality, deployed on Cloudflare Pages with D1 database integration.

## 1. Project Dependencies & Configuration

### 1.1 Install Required Packages
```bash
pnpm add drizzle-orm drizzle-kit @cloudflare/workers-types
pnpm add -D @types/node
```

### 1.2 Update nuxt.config.ts
- Add `@nuxtjs/tailwindcss` module (already in package.json)
- Configure Nitro for Cloudflare Pages deployment
- Add server-side handlers configuration
- Set up environment variables binding

### 1.3 Create wrangler.toml
- Configure Cloudflare Pages deployment
- Set up D1 database binding
- Configure compatibility settings for Nuxt 4

## 2. Database Setup with Drizzle ORM

### 2.1 Database Schema (drizzle/schema.ts)
```typescript
// signups table with:
// - id (primary key)
// - name (optional, varchar 255)
// - email (required, varchar 255, unique)
// - created_at (timestamp)
// - is_bot_flagged (boolean, default false)
// - canary_field_touched (boolean, default false)
```

### 2.2 Drizzle Configuration (drizzle.config.ts)
- Configure for Cloudflare D1
- Set up migrations directory
- Configure schema file path

### 2.3 Database Migration Scripts
- Create initial migration for signups table
- Add migration commands to package.json

## 3. Landing Page Implementation

### 3.1 Replace app/app.vue
- Clean, professional landing page layout
- Hero section with compelling value proposition
- Email signup form with name field (optional) and email field (required)
- Hidden canary field for bot detection
- TailwindCSS styling throughout
- Responsive design for mobile/desktop

### 3.2 Form Validation & UX
- Client-side validation for email format
- Loading states during form submission
- Success/error message display
- Form reset after successful submission

## 4. Server-Side API Implementation

### 4.1 API Route (/server/api/signup.post.ts)
- Accept POST requests with name, email, canary field
- Validate email format server-side
- Check canary field for bot detection
- Insert into D1 database using Drizzle ORM
- Handle duplicate email scenarios
- Return appropriate JSON responses

### 4.2 Database Connection
- Utility function to connect to D1 using Drizzle
- Proper error handling for database operations
- Type-safe database queries

## 5. Bot Protection Implementation

### 5.1 Canary Field Strategy
- Hidden input field in form (display: none, position: absolute)
- If field is filled, flag as potential bot
- Store bot detection result in database
- Still accept signup but mark for review

### 5.2 Additional Security Measures
- Rate limiting considerations (document for future enhancement)
- Input sanitization
- CORS configuration if needed

## 6. Development & Local Testing Setup

### 6.1 Environment Configuration
- .env.example with required variables
- Local development database setup instructions
- Miniflare configuration for local D1 testing

### 6.2 Development Scripts
- Database migration commands
- Local development with proper bindings
- Build and preview commands

## 7. Deployment Configuration

### 7.1 Cloudflare Pages Setup
- Detailed deployment instructions
- Environment variable configuration in Cloudflare dashboard
- D1 database creation and binding steps

### 7.2 Production Considerations
- Database migration workflow for production
- Error monitoring setup recommendations
- Performance optimization notes

## 8. File Structure Summary

```
├── app/
│   └── app.vue (landing page)
├── server/
│   └── api/
│       └── signup.post.ts (signup API)
├── drizzle/
│   ├── schema.ts (database schema)
│   └── migrations/ (auto-generated)
├── utils/
│   └── database.ts (D1 connection utility)
├── drizzle.config.ts
├── wrangler.toml
├── nuxt.config.ts (updated)
├── .env.example
└── package.json (updated scripts)
```

## 9. Testing Instructions

### 9.1 Local Development Testing
- Start development server with proper D1 bindings
- Test form submission with valid/invalid emails
- Test bot detection with canary field manipulation
- Verify database insertions

### 9.2 Production Deployment Testing
- Deploy to Cloudflare Pages
- Test with real database
- Verify email collection works end-to-end

## 10. Handoff Documentation

### 10.1 Developer Instructions
- Step-by-step setup guide
- Environment variable explanations
- Common troubleshooting scenarios
- Database management commands

### 10.2 Future Enhancement Notes
- Analytics integration points
- Email service integration suggestions
- Advanced bot protection options