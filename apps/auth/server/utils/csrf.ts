import { createError } from 'h3';

/**
 * Validates CSRF token from request body against session token
 */
export function validateCsrfToken(event: any, bodyToken: string | undefined): void {
  const sessionToken = event.context.csrfToken;
  
  if (!sessionToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF protection error: No session token available'
    });
  }

  if (!bodyToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF protection error: Missing CSRF token'
    });
  }

  if (bodyToken !== sessionToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF protection error: Invalid CSRF token'
    });
  }
}

/**
 * Gets the CSRF token from event context
 */
export function getCsrfToken(event: any): string {
  const token = event.context.csrfToken;
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CSRF token not available in context'
    });
  }
  return token;
}