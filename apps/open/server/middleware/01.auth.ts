import * as oauth from 'oauth4webapi'
import { useDb } from '~/db'
import { idpAuthRequests } from '~/db/schema/oidc'
import { sessions } from '~/db/schema/sessions';
import { users } from '~/db/schema/users';
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'


const publicRoutes = [
  '/auth/callback',
  '/auth/logout',
  '/auth/register',
]

export default defineEventHandler(async (event) => {
  if (publicRoutes.some((route) => event.node.req.url?.startsWith(route))) {
    return
  }
  const cookieHeader = event.headers?.get('cookie');
  const sessionId = cookieHeader?.split('; ').find((cookie) => cookie.startsWith('open_auth='))?.split('=')[1];

  if (sessionId) {
    const db = useDb(event.context.cloudflare.env);
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (session) {
      // Join with users table to get complete profile information
      const [userWithProfile] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      event.context.user = userWithProfile;
      return
    }
  }

  const challengeMethod = 'S256';
  const codeVerifier = oauth.generateRandomCodeVerifier();
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier)
  const state = oauth.generateRandomState()
  const nonce = oauth.generateRandomNonce()

  // add the codeVerifier to session
  event.context.session = event.context.session || {}
  event.context.session['open_auth_code_verifier'] = {
    codeVerifier,
    state,
  }
  const clientId = 'a7fd8769-858c-4b86-81a1-e3d825e6cc7d';
  const db = useDb(event.context.cloudflare.env);
  await db.insert(idpAuthRequests).values({
    id: randomUUID(),
    providerId: 'sdchi-auth',
    redirectUri: event.path,
    state,
    nonce,
    codeVerifier,
    challenge: codeChallenge,
    challengeMethod,
    scopes: 'openid profile email',
    status: 'initiated',
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  }).onConflictDoNothing().execute();

  const authorizationUrl = new URL('https://auth.labs.localhost.localdomain:3000/login')
  authorizationUrl.searchParams.set('client_id', clientId)
  authorizationUrl.searchParams.set('redirect_uri', 'https://open.labs.localhost.localdomain:2500/auth/callback')
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('state', state)
  authorizationUrl.searchParams.set('scope', 'openid profile email')
  authorizationUrl.searchParams.set('code_challenge', codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', challengeMethod)

  sendRedirect(event, authorizationUrl.href)
})
