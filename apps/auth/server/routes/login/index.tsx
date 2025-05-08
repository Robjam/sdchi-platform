import { sql, eq } from "drizzle-orm";
import { renderToString } from "hono/jsx/dom/server"
import { useDb } from "../../../db";
import { idpProviderClients, idps, sdchiClients, sdchiAuthRequests } from "../../../db/schema/oidc";
import { randomUUID } from "crypto";
import { Page } from "~/templates/Page";

export default defineEventHandler(async (event) => {
  const { searchParams } = new URL(`https://${event.headers.get('host')}${event.path}`);

  // Extract authorization request parameters
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const responseType = searchParams.get('response_type') || 'code';
  const clientState = searchParams.get('state');
  const clientChallenge = searchParams.get('code_challenge');
  const challengeMethod = searchParams.get('code_challenge_method') || 'S256';
  const scope = searchParams.get('scope') || 'openid profile email';

  // Validate required parameters
  if (!clientId) {
    throw new Error("Missing required parameter: client_id");
  }
  if (!redirectUri) {
    throw new Error("Missing required parameter: redirect_uri");
  }
  if (!clientState) {
    throw new Error("Missing required parameter: state");
  }
  if (!clientChallenge) {
    throw new Error("Missing required parameter: code_challenge");
  }

  // Security validations
  if (responseType !== 'code') {
    throw new Error("Unsupported response_type. Only 'code' is supported.");
  }
  if (challengeMethod !== 'S256') {
    throw new Error("Unsupported code_challenge_method. Only 'S256' is supported.");
  }
  
  // Validate code challenge format (base64url, 43-128 characters)
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(clientChallenge)) {
    throw new Error("Invalid code_challenge format");
  }
  
  // Validate state parameter (should be sufficiently random, 32+ characters)
  if (clientState.length < 32) {
    throw new Error("State parameter too short (minimum 32 characters required)");
  }

  const db = useDb((event.context.cloudflare.env as any));
  const [appClient] = await db
    .select()
    .from(sdchiClients)
    .where(eq(sdchiClients.id, clientId)).limit(1);

  if (!appClient) {
    throw new Error("Client not found");
  }

  // Validate redirect URI against registered URIs
  const registeredUris = JSON.parse(appClient.redirectUris);
  if (!registeredUris.includes(redirectUri)) {
    throw new Error("Invalid redirect_uri");
  }

  // Generate auth request ID and create database record
  const authRequestId = randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await db.insert(sdchiAuthRequests).values({
    id: authRequestId,
    clientId: clientId,
    redirectUri: redirectUri,
    responseType: responseType,
    state: clientState,
    challenge: clientChallenge,
    challengeMethod: challengeMethod,
    scope: scope,
    status: 'initiated',
    expiresAt: expiresAt,
  });

  const identityProviders = await db.select({
    name: idps.id,
  }).from(idpProviderClients).where(eq(idpProviderClients.sdchiClientId, appClient.id))
  .leftJoin(idps, eq(idpProviderClients.providerId, idps.id));
  if (!identityProviders.length) {
    throw new Error("Identity providers not found");
  }
  
  return renderToString(
    <Page class="h-full bg-white" title={`Login to ${appClient.applicationName}`} description="Sign in to your account">
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                alt="SDCHI"
                src="/images/SDCHI_logo.svg"
                className="h-10 w-auto"
              />
              <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm/6 text-gray-500">
                {appClient.applicationName} is currently in private beta. <br/>Please use one of the identity providers below to log in or register.
              </p>
            </div>

            <div className="mt-10">
              <div className="mt-10">
                <div className="mt-6 grid grid-cols-2 gap-4">
                  
                 {identityProviders.map((provider,index) => (
                   <form key={index} method="post" action="/authorize" className="flex w-full">
                     <input type="hidden" name="auth_request_id" value={authRequestId} />
                     <input type="hidden" name="provider_id" value={provider.name} />
                     <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent">
                       Login with {provider.name}
                     </button>
                   </form>
                 ))}
                </div>
                <div className="relative my-4">
                  <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 text-gray-900">Or email</span>
                  </div>
                </div>

                <div className="text-gray-500 text-center">
                  email recovery link coming soon
                </div>
                  
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            alt="Login Background"
            src="/images/login01.jpg"
            className="absolute inset-0 size-full object-cover object-[25%_90%]"
          />
        </div>
      </div>
    </Page>
  )
});
