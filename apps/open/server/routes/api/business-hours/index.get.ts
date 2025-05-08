import { defineEventHandler, createError } from 'h3';
import { useDb } from '~/db';
import { businessHours } from '~/db/schema/business_hours';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const db = useDb(event.context.cloudflare.env);

  try {
    // Get user's business hours templates
    const userBusinessHours = await db
      .select()
      .from(businessHours)
      .where(eq(businessHours.userId, event.context.user.id))
      .orderBy(businessHours.isDefault, businessHours.createdAt);

    // Parse JSON weekly templates
    const templates = userBusinessHours.map(template => ({
      id: template.id,
      name: template.name,
      isDefault: template.isDefault,
      weeklyTemplate: JSON.parse(template.weeklyTemplate),
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    }));

    return {
      templates,
      hasDefault: templates.some(t => t.isDefault)
    };
  } catch (error) {
    console.error('Error fetching business hours:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch business hours'
    });
  }
});