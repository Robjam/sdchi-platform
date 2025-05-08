import { defineEventHandler, createError, readBody } from 'h3';
import { useDb } from '~/db';
import { businessHours } from '~/db/schema/business_hours';
import { eq, and } from 'drizzle-orm';

// AIDEV-NOTE: Types for business hours (matching useCalendarDates.ts)
type TimeSlot = {
  start: string;
  end: string;
}

type OperatingHours = {
  periods: TimeSlot[];
} | null

type WeeklyTemplate = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, OperatingHours>

interface BusinessHoursRequest {
  id?: string;
  name: string;
  weeklyTemplate: WeeklyTemplate;
  isDefault?: boolean;
}

// AIDEV-NOTE: Validate weekly template structure
const validateWeeklyTemplate = (template: any): template is WeeklyTemplate => {
  if (!template || typeof template !== 'object') return false;
  
  const validDays = [0, 1, 2, 3, 4, 5, 6];
  for (const day of validDays) {
    const dayHours = template[day];
    
    if (dayHours !== null) {
      if (!dayHours || typeof dayHours !== 'object' || !Array.isArray(dayHours.periods)) {
        return false;
      }
      
      for (const period of dayHours.periods) {
        if (!period || typeof period !== 'object' || 
            typeof period.start !== 'string' || typeof period.end !== 'string') {
          return false;
        }
        
        // Validate time format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(period.start) || !timeRegex.test(period.end)) {
          return false;
        }
        
        // Validate that end > start
        if (period.start >= period.end) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const body = await readBody(event) as BusinessHoursRequest;
  
  // Validate required fields
  if (!body.name || !body.weeklyTemplate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and weeklyTemplate are required'
    });
  }

  // Validate weekly template structure
  if (!validateWeeklyTemplate(body.weeklyTemplate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid weekly template format'
    });
  }

  const db = useDb(event.context.cloudflare.env);

  try {
    const now = Date.now();
    
    if (body.id) {
      // Update existing template
      const existing = await db
        .select()
        .from(businessHours)
        .where(and(
          eq(businessHours.id, body.id),
          eq(businessHours.userId, event.context.user.id)
        ))
        .limit(1);

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Business hours template not found'
        });
      }

      // If setting as default, unset other defaults first
      if (body.isDefault) {
        await db
          .update(businessHours)
          .set({ isDefault: false, updatedAt: now })
          .where(and(
            eq(businessHours.userId, event.context.user.id),
            eq(businessHours.isDefault, true)
          ));
      }

      // Update the template
      await db
        .update(businessHours)
        .set({
          name: body.name,
          weeklyTemplate: JSON.stringify(body.weeklyTemplate),
          isDefault: body.isDefault || false,
          updatedAt: now
        })
        .where(and(
          eq(businessHours.id, body.id),
          eq(businessHours.userId, event.context.user.id)
        ));

      return { 
        id: body.id,
        message: 'Business hours updated successfully' 
      };
    } else {
      // Create new template
      const id = crypto.randomUUID();

      // If setting as default, unset other defaults first
      if (body.isDefault) {
        await db
          .update(businessHours)
          .set({ isDefault: false, updatedAt: now })
          .where(and(
            eq(businessHours.userId, event.context.user.id),
            eq(businessHours.isDefault, true)
          ));
      }

      await db.insert(businessHours).values({
        id,
        userId: event.context.user.id,
        name: body.name,
        weeklyTemplate: JSON.stringify(body.weeklyTemplate),
        isDefault: body.isDefault || false,
        createdAt: now,
        updatedAt: now
      });

      return { 
        id,
        message: 'Business hours created successfully' 
      };
    }
  } catch (error) {
    console.error('Error saving business hours:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save business hours'
    });
  }
});