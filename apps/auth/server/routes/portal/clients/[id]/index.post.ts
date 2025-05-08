import { eq } from "drizzle-orm";
import { useDb } from "~~/db";
import { sdchiClients } from "~~/db/schema/oidc";
import { validateCsrfToken } from '~/utils/csrf';

export default defineEventHandler(async (event) => {
  const db = useDb((event.context.cloudflare.env as any));
  const body = await readBody(event);
  const { id } = event.context.params;

  // Validate CSRF token
  validateCsrfToken(event, body._csrf);

  // Validate required parameters
  if (!id || !body.application_name || !body.client_secret || !body.redirect_uri) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'invalid_request'
    }));
  }

  const redirectUris = body.redirect_uri.split('\n').map(uri => uri.trim()).map(parseValidRedirectUri);

  if (redirectUris.some(uri => uri === null)) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'invalid_redirect_uri',
      data: 'One or more redirect URIs are invalid. They must be valid HTTPS URLs.'
    }));
  }

  // Update the client in the database
  await db.update(sdchiClients)
    .set({
      applicationName: body.application_name,
      id: body.client_id,
      tokenSecret: body.client_secret,
      redirectUris: JSON.stringify(redirectUris),
    })
    .where(eq(sdchiClients.id, id));

  return sendRedirect(event, '/portal/clients');
});

export function parseValidRedirectUri(uri: string): string | null {
  try {
    const url = new URL(uri);
    if (url.protocol === 'https:') {
      return url.toString();
    }
  } catch (e) {
    // Ignore invalid URLs
    console.error('Invalid redirect URI:', uri, e);
  }
  return null;
}
