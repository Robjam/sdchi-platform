-- Seed data for SDCHI Auth service
-- Run this after migrations to populate base configuration

-- Identity Providers
INSERT INTO idps VALUES('LINE','2006019945','LINE_SECRET',NULL,'https://access.line.me/oauth2/v2.1/authorize','https://api.line.me/oauth2/v2.1/token','https://api.line.me/v2/profile','profile openid email','2025-05-21T00:00:00.000Z','2025-05-21 00:00:00T00:00:00.000Z',NULL);

-- SDCHI OAuth Clients
INSERT INTO sdchi_clients VALUES('a7fd8769-858c-4b86-81a1-e3d825e6cc7d','SDCHI open','["https://open.labs.localhost.localdomain:2500/auth/callback"]','131b5bd53d667dc65cdabd35f5e1a595943a288b365e210bb6a4a856c1cfb859',NULL,'2025-05-23T00:00:00.000Z',NULL);

-- IDP to Client associations
INSERT INTO idp_sdchi_clients VALUES('747a6150-2626-44cf-9036-f9e4ea5856dd','LINE','a7fd8769-858c-4b86-81a1-e3d825e6cc7d','2025-05-21T00:00:00.000Z','2025-05-21T00:00:00.000Z',NULL);