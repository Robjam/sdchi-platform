## @apps/auth Endpoints Implementation Guide

To help with implementation, here's a detailed list of the required endpoints for the `@apps/auth`:

### Authentication Endpoints

1. **Authorization Endpoint**
    
    - **Path**: `/authorize`
    - **Method**: `GET`
    - **Description**: Entry point for the OAuth flow
    - **Parameters**: Standard OAuth authorization parameters (client_id, redirect_uri, etc.)
    - **Response**: HTML login page or redirect to IDP
2. **Provider Connection Endpoint**
    
    - **Path**: `/connect/{provider}` (e.g., `/connect/google`, `/connect/line`)
    - **Method**: `POST` or `GET`
    - **Description**: Initiates OAuth flow with selected IDP
    - **Parameters**: May include additional parameters for the specific provider`
    - **Response**: Redirect to the IDP's authorization endpoint
3. **Provider Callback Endpoint**
    
    - **Path**: `/callback/{provider}` (e.g., `/callback/google`, `/callback/line`)
    - **Method**: `GET`
    - **Description**: Endpoint where IDPs redirect after authentication
    - **Parameters**: `code` and `state` from IDP
    - **Response**: Processes the callback and redirects to client application

### Token Endpoints

4. **Token Endpoint**
    
    - **Path**: `/token`
    - **Method**: `POST`
    - **Description**: Issues tokens in exchange for authorization codes or refresh tokens
    - **Parameters**:
        - For authorization code: `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `client_secret`, `code_verifier`
        - For refresh token: `grant_type=refresh_token`, `refresh_token`, `client_id`, `client_secret`
    - **Response**: JSON with access_token, id_token, refresh_token, and expires_in
5. **Token Introspection Endpoint**
    
    - **Path**: `/introspect`
    - **Method**: `POST`
    - **Description**: Validates tokens and returns their metadata
    - **Parameters**: `token` and `token_type_hint`
    - **Response**: JSON with token validity and metadata
6. **Token Revocation Endpoint**
    
    - **Path**: `/revoke`
    - **Method**: `POST`
    - **Description**: Revokes access or refresh tokens
    - **Parameters**: `token`, `token_type_hint`, `client_id`, `client_secret`
    - **Response**: Status indicating successful revocation

### User Info and Discovery Endpoints

7. **UserInfo Endpoint**
    
    - **Path**: `/userinfo`
    - **Method**: `GET` with bearer token or `POST` with token in body
    - **Description**: Returns information about the authenticated user
    - **Parameters**: Access token in Authorization header or request body
    - **Response**: JSON with user profile information
8. **OpenID Connect Discovery Endpoint**
    
    - **Path**: `/.well-known/openid-configuration`
    - **Method**: `GET`
    - **Description**: Provides OIDC configuration metadata
    - **Parameters**: None
    - **Response**: JSON with OIDC configuration
9. **JWKS Endpoint**
    
    - **Path**: `/jwks`
    - **Method**: `GET`
    - **Description**: Provides public keys for verifying JWT signatures
    - **Parameters**: None
    - **Response**: JSON Web Key Set (JWKS)

### Session Management Endpoints

10. **Logout Endpoint**
    - **Path**: `/logout`
    - **Method**: `GET` or `POST`
    - **Description**: Ends user session and optionally redirects
    - **Parameters**: `id_token_hint`, `post_logout_redirect_uri`, `state`
    - **Response**: Confirmation page or redirect

## WEB_APP_1 Endpoints Implementation Guide

Here are the required endpoints for WEB_APP_1:

1. **OAuth Callback Endpoint**
    
    - **Path**: `/oauth/callback`
    - **Method**: `GET`
    - **Description**: Endpoint where `@apps/auth` redirects after authentication
    - **Parameters**: `code` and `state`
    - **Response**: Processes the callback, exchanges code for tokens, and redirects to original URL
2. **Session Check Endpoint** (Optional but recommended)
    
    - **Path**: `/api/session`
    - **Method**: `GET`
    - **Description**: Endpoint for checking session validity
    - **Parameters**: Session cookie
    - **Response**: Session status and basic user info
3. **Logout Endpoint**
    
    - **Path**: `/logout`
    - **Method**: `POST`
    - **Description**: Ends user session and optionally initiates logout at `@apps/auth`
    - **Parameters**: None (uses session)
    - **Response**: Redirect to login or home page# OAuth/OIDC Implementation Guide: Token Broker Pattern

This document provides a detailed walkthrough of implementing a Token Broker authorization flow, where an `@apps/auth` mediates between external Identity Providers (IDPs) and your web applications. This architecture centralizes authentication logic and provides a single sign-on experience across multiple applications.

## System Architecture Overview

```mermaid
sequenceDiagram
    participant Client
    participant WebApp1 as WEB_APP_1
    participant AuthServer as `@apps/auth`
    participant IDP as IDP (Google, LINE, Facebook)
    
    Client->>WebApp1: 1. Initial Request (Protected Resource)
    WebApp1->>Client: 2. Redirect to `@apps/auth` /authorize
    Client->>AuthServer: 3. GET /authorize with OAuth parameters
    Note over AuthServer: 4. Display login options
    AuthServer->>Client: 5. Redirect to selected IDP OAuth endpoint
    Client->>IDP: Authentication request
    IDP->>Client: Authentication response
    Client->>AuthServer: 6. Callback to /callback with auth code
    AuthServer->>IDP: 7. POST to /token - Exchange code for tokens
    IDP->>AuthServer: Return tokens
    AuthServer->>Client: 8. Redirect to WEB_APP_1 /oauth/callback with new code
    Client->>WebApp1: 9. GET /oauth/callback with code
    WebApp1->>AuthServer: 10. POST /token - Token exchange & validation
    AuthServer->>WebApp1: Return tokens and validation result
    WebApp1->>Client: 11. Access Granted (Create session)
```

## Complete Flow with Parameters and Database Operations

### Phase 1: Initial Access & Redirection to `@apps/auth`

#### Step 1: CLIENT accesses WEB_APP_1 (protected resource)

- **HTTP Request**: `GET https://webapp1.example.com/dashboard`
- **Action**: User attempts to access a protected page on WEB_APP_1
- **Parameters**: None (initial HTTP request)
- **Security Consideration**: WEB_APP_1 checks for valid session cookie or token

#### Step 2: WEB_APP_1 redirects to `@apps/auth`

- **HTTP Redirect**: `302 Found` to `https://auth.example.com/authorize?[oauth_params]`
- **Action**: WEB_APP_1 generates redirect to `@apps/auth` with OAuth parameters
- **Parameters**:
    - `client_id`: WEB_APP_1's identifier registered with `@apps/auth`
    - `redirect_uri`: `https://webapp1.example.com/oauth/callback`
    - `response_type`: "code" (for Authorization Code flow)
    - `scope`: "openid profile email" (depends on required info)
    - `state`: Random secure string to prevent CSRF attacks
    - `code_challenge`: SHA256 hash of a random `code_verifier` (PKCE)
    - `code_challenge_method`: "S256" (SHA256 algorithm)
    - `nonce`: Random string to prevent replay attacks
    - `original_url`: (Optional) Encoded URL user was trying to access
- **Database Operations**:
    - WEB_APP_1 stores the `state`, `code_verifier`, and `nonce` in a temporary session or database with short expiry (typically 10 minutes)
    - **WHY**: To validate the response and complete PKCE flow later

### Phase 2: User Authentication with External IDP

#### Step 3: CLIENT is redirected to `@apps/auth`

- **HTTP Request**: `GET https://auth.example.com/authorize?[oauth_params]`
- **Action**: Browser redirects to `@apps/auth` login page
- **Parameters**: All parameters from Step 2
- **Security Consideration**: Use HTTPS for all redirects

#### Step 4: `@apps/auth` displays login options

- **HTTP Response**: HTML login page with provider options
- **Action**: `@apps/auth` presents login methods (LINE, Google, Facebook, etc.)
- **Database Operations**:
    - `@apps/auth` stores the received parameters temporarily in a `pending_authorizations` table
    - **WHY**: To associate the external IDP authentication with the original request

#### Step 5: USER selects an IDP and `@apps/auth` redirects to that IDP

- **HTTP Request**: `POST https://auth.example.com/connect/[provider]`
- **HTTP Redirect**: `302 Found` to `https://[provider].com/oauth/authorize?[oauth_params]`
- **Action**: `@apps/auth` generates OAuth request to selected IDP
- **Parameters**:
    - `client_id`: `@apps/auth`'s identifier registered with the IDP
    - `redirect_uri`: `https://auth.example.com/callback/[provider]`
    - `response_type`: "code"
    - `scope`: "openid profile email" (adjust based on IDP and required info)
    - `state`: New random secure string
    - `code_challenge`: New SHA256 hash of a new random `code_verifier` (PKCE for `@apps/auth` to IDP flow)
    - `code_challenge_method`: "S256"
    - `nonce`: New random string
- **Database Operations**:
    - `@apps/auth` stores:
        1. The original request parameters from WEB_APP_1
        2. The new `state`, `code_verifier`, and `nonce` for the IDP request
        3. Mapping between these two sets of data
    - **WHY**: To track the relationship between original app request and IDP auth

#### Step 6: USER authenticates with IDP and is redirected back to `@apps/auth`

- **HTTP Redirect**: `302 Found` to `https://auth.example.com/callback/[provider]?code=[auth_code]&state=[state]`
- **Action**: User logs into IDP and authorizes the requested scopes
- **Parameters returned to `@apps/auth`**:
    - `code`: Authorization code from IDP
    - `state`: Same state sent in Step 5
- **Security Consideration**: Verify the returned `state` matches what was sent

#### Step 7: `@apps/auth` exchanges code for tokens with IDP

- **HTTP Request**: `POST https://[provider].com/oauth/token`
- **Action**: `@apps/auth` makes server-to-server request to IDP token endpoint
- **Parameters**:
    - `grant_type`: "authorization_code"
    - `code`: Authorization code received in Step 6
    - `redirect_uri`: Same redirect_uri from Step 5
    - `client_id`: `@apps/auth`'s identifier with the IDP
    - `client_secret`: `@apps/auth`'s secret (if applicable)
    - `code_verifier`: Original plain text value that was hashed in Step 5
- **Response from IDP**:
    - `access_token`: For accessing IDP resources
    - `id_token`: Contains user identity information (JWT)
    - `refresh_token`: For obtaining new tokens
    - `expires_in`: Validity period in seconds
- **Security Consideration**: Validate the `id_token` signature and claims

#### Step 8: `@apps/auth` redirects back to WEB_APP_1

- **HTTP Redirect**: `302 Found` to `https://webapp1.example.com/oauth/callback?code=[auth_code]&state=[state]`
- **Action**: After processing IDP tokens, `@apps/auth` redirects to WEB_APP_1
- **Parameters**:
    - `code`: New authorization code generated by `@apps/auth`
    - `state`: Original state from Step 2
- **Database Operations**:
    - `@apps/auth` stores:
        1. IDP tokens (access, id, refresh) in an encrypted format
        2. User information extracted from ID token
        3. Association with newly generated code
        4. Expiration times for all tokens
    - **WHY**: `@apps/auth` acts as token broker, storing external tokens securely
- **Security Considerations**:
    - Store tokens in encrypted format
    - Set appropriate expiry times
    - Store only necessary user data

### Phase 3: Token Exchange with WEB_APP_1

#### Step 9: WEB_APP_1 exchanges code for tokens with `@apps/auth`

- **HTTP Request**: `POST https://auth.example.com/token`
- **Action**: WEB_APP_1 makes server-to-server request to `@apps/auth` token endpoint
- **Parameters**:
    - `grant_type`: "authorization_code"
    - `code`: Code received in Step 8
    - `redirect_uri`: Same as Step 2
    - `client_id`: WEB_APP_1's identifier
    - `client_secret`: WEB_APP_1's secret (if applicable)
    - `code_verifier`: Original plain text from Step 2
- **Response from `@apps/auth`**:
    - `access_token`: For accessing `@apps/auth` resources
    - `id_token`: Contains user identity (JWT)
    - `refresh_token`: For obtaining new tokens
    - `expires_in`: Validity period in seconds
- **Database Operations**:
    - `@apps/auth` records the token issuance with:
        1. Token identifiers (not the tokens themselves)
        2. Association with user
        3. Client application identifier
        4. Scope of access granted
        5. Expiration information
    - **WHY**: For audit trail and token revocation capability

#### Step 10: WEB_APP_1 validates tokens with `@apps/auth`

- **HTTP Request**: `POST https://auth.example.com/introspect` (optional extra validation)
- **Action**: WEB_APP_1 validates the tokens received from `@apps/auth`
- **Validation Steps**:
    1. Verify `id_token` signature (locally or via `@apps/auth`)
    2. Validate claims (`iss`, `aud`, `exp`, `iat`, `nonce`)
    3. Extract user information
- **Database Operations**:
    - WEB_APP_1 stores:
        1. Tokens (securely encrypted)
        2. User information
        3. Session expiration
    - **WHY**: To maintain user session and refresh tokens when needed

#### Step 11: WEB_APP_1 creates session and grants access

- **HTTP Redirect**: `302 Found` to original URL or dashboard
- **Action**: WEB_APP_1 creates authenticated session and redirects to original URL
- **Parameters**:
    - Application session cookie or token
- **Database Operations**:
    - WEB_APP_1 updates user session information
    - Links session to stored tokens
    - **WHY**: To track active sessions and handle token refreshes

## Token Refresh Processes

### `@apps/auth` Refreshing IDP Tokens

```mermaid
sequenceDiagram
    participant BgJob as Background Job
    participant AuthServer as `@apps/auth`
    participant IDP as IDP (Google, LINE, Facebook)
    participant DB as Database
    
    Note over BgJob: Token expiration check
    BgJob->>DB: Check for tokens near expiration
    DB->>BgJob: Return tokens to refresh
    BgJob->>AuthServer: Trigger token refresh
    AuthServer->>IDP: POST /token - Refresh token request
    IDP->>AuthServer: Return new tokens
    AuthServer->>DB: Update stored tokens
    AuthServer->>DB: Update expiration times
```

- **HTTP Request**: `POST https://[provider].com/oauth/token`
- **Parameters**:
    - `grant_type`: "refresh_token"
    - `refresh_token`: Stored refresh token for the IDP
    - `client_id`: `@apps/auth`'s identifier with the IDP
    - `client_secret`: If required by IDP
- **Database Operations**:
    - Update stored tokens
    - Update expiration times
    - **WHY**: Maintain valid tokens without requiring user re-authentication

### WEB_APP_1 Refreshing `@apps/auth` Tokens

```mermaid
sequenceDiagram
    participant BgJob as Background Job
    participant WebApp1 as WEB_APP_1
    participant AuthServer as `@apps/auth`
    participant DB as Database
    
    Note over BgJob: Token expiration check
    BgJob->>DB: Check for tokens near expiration
    DB->>BgJob: Return tokens to refresh
    BgJob->>WebApp1: Trigger token refresh
    WebApp1->>AuthServer: POST /token - Refresh token request
    AuthServer->>WebApp1: Return new tokens
    WebApp1->>DB: Update stored tokens
    WebApp1->>DB: Update expiration times
```

- **HTTP Request**: `POST https://auth.example.com/token`
- **Parameters**:
    - `grant_type`: "refresh_token"
    - `refresh_token`: Stored refresh token
    - `client_id`: WEB_APP_1's identifier
    - `client_secret`: If required
- **Database Operations**:
    - Update stored tokens
    - Update expiration times
    - **WHY**: Maintain valid tokens without disrupting user experience

## Database Schema Recommendations

### `@apps/auth` Database

#### Users Table

```sql
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  picture VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### External Identities Table

```sql
CREATE TABLE external_identities (
  identity_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(user_id),
  provider VARCHAR(50), -- "google", "line", "facebook"
  provider_user_id VARCHAR(255),
  email VARCHAR(255),
  access_token TEXT ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  id_token TEXT ENCRYPTED,
  access_token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);
```

#### Authorization Codes Table

```sql
CREATE TABLE authorization_codes (
  code VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(user_id),
  client_id VARCHAR(36),
  redirect_uri TEXT,
  scope VARCHAR(255),
  nonce VARCHAR(100),
  code_challenge VARCHAR(128),
  code_challenge_method VARCHAR(10),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tokens Table

```sql
CREATE TABLE tokens (
  token_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(user_id),
  client_id VARCHAR(36),
  access_token TEXT ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  id_token TEXT ENCRYPTED,
  scope VARCHAR(255),
  access_token_expires_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### WEB_APP_1 Database

#### User Sessions Table

```sql
CREATE TABLE user_sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  access_token TEXT ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  id_token TEXT ENCRYPTED,
  user_info JSON,
  access_token_expires_at TIMESTAMP,
  refresh_token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

### PKCE Necessity

PKCE is necessary in two places:

1. **Between `@apps/auth` and IDP**:
    
    - **WHY**: Prevents authorization code interception attacks
    - **Implementation**: `@apps/auth` generates code_verifier and code_challenge
2. **Between WEB_APP_1 and `@apps/auth`**:
    
    - **WHY**: Provides the same protection for your internal authorization flow
    - **Implementation**: WEB_APP_1 generates its own code_verifier and code_challenge

### Token Storage

- **Never store tokens in browser localStorage or sessionStorage**
- **Refresh tokens** must be stored securely in server-side database with encryption
- **Access tokens** can be stored in:
    - HttpOnly, Secure cookies (preferred for web applications)
    - Server-side session store
- **ID tokens** should be stored server-side and only necessary claims sent to frontend

### Session Management

- Implement session inactivity timeouts
- Provide option for users to view and terminate active sessions
- Implement proper session invalidation on logout

### Token Validation

- Always validate token signatures
- Verify all standard JWT claims (iss, aud, exp, iat, etc.)
- For ID tokens, validate the nonce claim to prevent replay attacks

## Implementation Tips

### Handling Token Expiration

1. **Proactive Renewal**:
    
    - Set up a background job to refresh tokens before they expire
    - Typically refresh when 75% of the lifetime has elapsed
2. **On-Demand Renewal**:
    
    - When an API call fails with 401, attempt token refresh
    - Retry the original request with the new token

### Error Handling

- Implement robust error handling for token exchange failures
- Have fallback mechanisms for temporary IDP outages
- Provide clear error messages to users when authentication fails

### Logging and Monitoring

- Log authentication events for security auditing
- Monitor token usage patterns for anomalies
- Track failed authentication attempts

## FAQ for Implementation

1. **Why use a separate `@apps/auth` instead of direct IDP integration?**
    
    - Centralizes authentication logic
    - Provides consistent user experience
    - Simplifies adding/removing identity providers
    - Enables single sign-on across multiple applications
2. **How to handle token revocation?**
    
    - Implement endpoint to revoke tokens
    - On logout, revoke both `@apps/auth` tokens and IDP tokens if possible
    - Update database to mark tokens as revoked
3. **What happens if an IDP is temporarily unavailable?**
    
    - Implement circuit breaker pattern
    - Provide alternative login methods
    - Consider caching user identity information for limited offline access

