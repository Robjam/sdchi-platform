import { z, ZodError } from 'zod'
import { getDatabase } from '../../utils/database'
import { signups } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'
import { errorMonitor } from 'node:stream'

const signupSchema = z.object({
  name: z.string().max(255).optional(),
  company: z.string().max(255).optional(),
  email: z.string().email().max(255),
  canary: z.string().optional(),
  source: z.string().max(100).optional(),
  service: z.string().max(100).optional()
})

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const { name, company, email, canary, source, service } = signupSchema.parse(body)

    // Bot detection: if canary field is filled, flag as potential bot
    const isBotFlagged = Boolean(canary && canary.trim().length > 0)
    const canaryFieldTouched = Boolean(canary !== undefined)
    console.log(event.context.cloudflare.context)
    // Get database connection
    const db = getDatabase(event.context.cloudflare.env)

    // Check if email already exists
    const existingSignup = await db
      .select()
      .from(signups)
      .where(eq(signups.email, email))
      .get()

    if (existingSignup) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    }

    // Insert new signup
    const newSignup = await db
      .insert(signups)
      .values({
        name: name || null,
        company: company || null,
        email,
        source: source || null,
        service: service || null,
        isBotFlagged,
        canaryFieldTouched
      })
      .returning()
      .get()

    // Return success response
    return {
      success: true,
      message: 'Successfully registered for early access!',
      id: newSignup.id
    }

  } catch (error) {
    console.error('Signup error:', error)
    if (!(error instanceof Error)) {
      return;
    }
    // Handle validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid input data',
        // TODO: determine what the type is for this. I think if zod is v3 there has been some changes around this.
        data: { errors: (error as any).errors }
      })
    }

    // Handle database errors
    if (error.message?.includes('UNIQUE constraint')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    }

    // Generic error for other cases
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})