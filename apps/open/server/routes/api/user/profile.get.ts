import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  // Return sanitized user profile
  return {
    id: event.context.user.id,
    name: event.context.user.name,
    email: event.context.user.email,
    picture: event.context.user.picture,
  };
});