import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { useDb } from '~~/db';
import { sdchiClients } from '~~/db/schema/oidc';
import { randomUUID, randomBytes } from 'crypto';
import { validateCsrfToken } from '~/utils/csrf';

const ClientSchema = z.object({
  application_name: z.string().min(2, "Must be at least 2 characters"),
  client_id: z.string().min(3, "Must be at least 3 characters"),
  client_secret: z.string().min(8, "Must be at least 8 characters"),
  redirect_uri: z.string().url("Invalid URL format")
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validate CSRF token
  validateCsrfToken(event, body._csrf);
  
  const validation = ClientSchema.safeParse(body);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return sendRedirect(event, `/portal/clients/new?errors=${encodeURIComponent(JSON.stringify(errors))}`);
  }

  const { application_name, client_id, client_secret, redirect_uri } = validation.data;
  // Generate a unique client ID and secret
  const uniqueClientId = randomUUID();
  const uniqueClientSecret = randomBytes(32).toString('hex');
  const db = useDb((event.context.cloudflare.env as any));
  await db.insert(sdchiClients).values({
    id: uniqueClientId,
    applicationName: application_name,
    redirectUris: JSON.stringify([redirect_uri]),
    tokenSecret: uniqueClientSecret,
  });

  return sendRedirect(event, '/portal/clients');
});
