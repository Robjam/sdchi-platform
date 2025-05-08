import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { defineEventHandler, H3Event, sendRedirect } from 'h3';
import { OAuth2Client } from 'arctic';
import { IncomingMessage, ServerResponse } from 'http';

// Mock environment variables
vi.mock('process', () => ({
  env: {
    OAUTH_CLIENT_ID: 'test_client_id',
    OAUTH_CLIENT_SECRET: 'test_client_secret',
    OAUTH_REDIRECT_URI: 'http://localhost:3000/callback',
    OAUTH_AUTHORIZATION_ENDPOINT: 'https://oauth.example.com/auth',
    OAUTH_TOKEN_ENDPOINT: 'https://oauth.example.com/token',
    NODE_ENV: 'test'
  }
}));

// Mock Arctic OAuth2Client constructor and methods
vi.mock('arctic', () => ({
  OAuth2Client: vi.fn().mockImplementation((clientId: string, clientSecret: string, redirectURI: string) => ({
    clientId,
    redirectURI,
    createAuthorizationURL: vi.fn().mockResolvedValue(new URL('https://oauth.example.com/auth')),
    createAuthorizationURLWithPKCE: vi.fn(),
    validateAuthorizationCode: vi.fn(),
    refreshAccessToken: vi.fn(),
    revokeToken: vi.fn()
  })),
  generateState: vi.fn().mockReturnValue('mock_state_value')
}));

vi.mock('h3', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    sendRedirect: vi.fn()
  };
});

describe('GET /authorize', () => {
  const mockEvent: H3Event = {
    __is_event__: true,
    _handled: false,
    _onBeforeResponseCalled: false,
    _onAfterResponseCalled: false,
    node: {
      req: {} as IncomingMessage,
      res: {
        getHeader: vi.fn(),
        setHeader: vi.fn(),
        end: vi.fn(),
        statusCode: 200
      } as unknown as ServerResponse
    },
    context: {},
    path: '/authorize',
    method: 'GET',
    headers: {},
    web: null,
    websocket: null,
    _requestBody: null,
    _requestBodyStream: null,
    _parsedBody: null,
    _matchedRoute: null
  } as unknown as H3Event;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create authorization URL and set cookies', async () => {
    // Import the actual handler after mocking
    const handler = (await import('./index.post')).default;

    await handler(mockEvent);
    // Verify redirect was called
    expect(sendRedirect).toHaveBeenCalledWith(
      mockEvent,
      expect.stringContaining('https://oauth.example.com/auth')
    );

    // Verify cookies set
    const setCookieHeader = (mockEvent.node.res.setHeader as Mock).mock.calls[0][1];

    //TODO: confirm is this the correct values for the cookie
    expect(setCookieHeader).toEqual('oauth_state=mock_state_value; Max-Age=600; Path=/; HttpOnly');
  });

  it('should include required scopes in authorization URL', async () => {
    const mockCreateAuthorizationURL = vi.fn().mockResolvedValue(new URL('https://oauth.example.com/auth'));
    vi.mocked(OAuth2Client).mockImplementation(() => ({
      clientId: 'test_client_id',
      clientPassord: 'test_client_secret',
      redirectURI: 'http://localhost:3000/callback',
      createAuthorizationURL: mockCreateAuthorizationURL,
      createAuthorizationURLWithPKCE: vi.fn(),
      validateAuthorizationCode: vi.fn(),
      refreshAccessToken: vi.fn(),
      revokeToken: vi.fn()
    } as unknown as OAuth2Client));

    const handler = (await import('./index.post')).default;
    await handler(mockEvent);

    expect(mockCreateAuthorizationURL).toHaveBeenCalledWith(
      'mock_state_value',
      expect.any(String),
      ['openid', 'profile', 'email']
    );
  });
});