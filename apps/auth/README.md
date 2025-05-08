# Auth Service
## About this repository:
sdchi-auth is a full-ts, cloudflare pages/workers-based monorepo. 
Packages are handles with pnpm, tests are handled with vitest. 
Build is handled with nitro.
ORM is drizzle with d1-http as the driver.

sdchi-auth implements OIDC PKCE authorization flows.

## Table of Contents
- [Development Setup](#development-setup)
- [Migration Workflow](#migration-workflow)
- [Environment Configuration](#environment-configuration)

## Development Setup
```
pnpm install
```

## How do I...

### create a migration?
1. Generate initial migrations from schema definitions:
   ```bash
   pnpm run db:generate
   ```
2. Review generated SQL in `drizzle/` directory
3. Apply migrations to local D1 database:
   ```bash
   pnpm run migrate
   ```

### start the local auth server?
two options:
1. from the `<root>` directory run:
```
pnpm run dev:auth
```
2. from the `apps/auth` directory run:
```
pnpm turbo run dev
```

## Environment Configuration

### Development Environment
Required `.env` values for local development:

※ Note that SSL certificates should be generated from the root directory scripts.
If you have not done that yet, please read the root README.md

```bash
# Local Development Configuration
CLOUDFLARE_ACCOUNT_ID=dummy-account-id
CLOUDFLARE_D1_TOKEN=dummy-token
NITRO_SSL_KEY="/Users/{pc_user_name}/certs/localhost.localdomain+3-key.pem"
NITRO_SSL_CERT="/Users/{pc_user_name}/certs/localhost.localdomain+3.pem"

# Authentication Configuration
BASE_URL=https://auth.labs.localhost.localdomain:3000
COOKIE_DOMAIN=labs.localhost.localdomain
LINE_CLIENT_SECRET=your_line_client_secret

# Portal Admin Authentication (Azure Entra)
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

### Production Environment
Required environment variables for deployment:

```bash
# Core Service Configuration
BASE_URL=https://auth.yourdomain.com
COOKIE_DOMAIN=yourdomain.com
SESSION_MAX_AGE=172800  # 48 hours in seconds

# OAuth Provider Configuration
LINE_CLIENT_SECRET=your_line_client_secret

# Portal Admin Authentication (Azure Entra)
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret

# Optional Configuration
PUBLIC_APP_NAME="Your Company Auth"  # Defaults to "SDCHI Auth"
```

### Cloudflare Deployment
For Cloudflare Pages/Workers deployment:

1. Set environment variables in Cloudflare dashboard
2. Configure wrangler CLI with account ID:
   ```bash
   wrangler deploy --env production --account-id your_account_id
   ```
3. Database configuration is handled via `wrangler.toml` per environment

## Project Structure
```
auth/
├── db/
│   ├── index.ts        # Database client
│   └── schema/         # Table definitions
├── drizzle/            # Generated migrations
└── server/             # Nitro API routes
```

[Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
[Nitro Framework Guide](https://nitro.unjs.io/guide#quick-start)
