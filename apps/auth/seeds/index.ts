import { db } from '../db';
import { users } from '../db/schema/users';
import { sdchiClients, idps, idpProviderClients } from '../db/schema/oidc';
import { nanoid } from 'nanoid';

export async function seedDatabase(env: string = process.env.NODE_ENV || 'development') {
  console.log(`🌱 Starting database seeding for ${env} environment...`);

  // Environment-specific configurations
  const adminEmail = env === 'production' 
    ? 'admin@yourdomain.com' 
    : `admin+${env}@example.com`;

  // Seed users table
  console.log('📊 Seeding users...');
  const seedUsers = [
    {
      id: nanoid(),
      email: adminEmail,
      emailVerified: true,
    },
    {
      id: nanoid(),
      email: 'user@example.com', // TODO: Replace with real user email
      emailVerified: true,
      hashedPassword: null,
    },
    {
      id: nanoid(),
      email: 'developer@example.com', // TODO: Replace with real developer email
      emailVerified: false,
      hashedPassword: null,
    },
  ];

  await db.insert(users).values(seedUsers);
  console.log(`✅ Inserted ${seedUsers.length} users`);

  // Seed sdchi_clients table
  console.log('📊 Seeding SDCHI clients...');
  
  // Environment-specific client configuration
  const openAppUrl = env === 'production' 
    ? 'https://open.yourdomain.com' 
    : env === 'preview'
    ? 'https://open-preview.yourdomain.com'
    : 'https://open.labs.localhost.localdomain:2500';
  
  const seedClients = [
    {
      id: 'bcdff620-c8de-4149-8af4-3882418c6f8f',
      applicationName: 'SDCHI open',
      redirectUris: JSON.stringify([
        `${openAppUrl}/auth/callback`,
      ]),
      tokenSecret: 'b31a9571e4e007e877e5e1e249664e0b105cecdd46e99c014fcfa880f5f1c65e',
    },
  ];

  await db.insert(sdchiClients).values(seedClients);
  console.log(`✅ Inserted ${seedClients.length} SDCHI clients`);

  // Seed idps table
  console.log('📊 Seeding IDP providers...');
  const seedProviders = [
    {
      id: 'LINE',
      clientId: '2006019945',
      clientSecret: process.env.LINE_CLIENT_SECRET,
      discoveryUrl: null,
      authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
      tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
      userInfoUrl: 'https://api.line.me/v2/profile',
      scopes: 'PROFILE, OPENID_CONNECT',
    },
  ];

  await db.insert(idps).values(seedProviders);
  console.log(`✅ Inserted ${seedProviders.length} IDP providers`);

  // Seed idp_clients table (mapping providers to clients)
  console.log('📊 Seeding IDP provider client mappings...');
  const seedProviderClients = [
    {
      id: nanoid(),
      providerId: 'LINE',
      sdchiClientId: 'bcdff620-c8de-4149-8af4-3882418c6f8f',
    },
  ];

  await db.insert(idpProviderClients).values(seedProviderClients);
  console.log(`✅ Inserted ${seedProviderClients.length} IDP provider client mappings`);

  console.log('🎉 Database seeding completed successfully!');
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
