import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    solutions: defineCollection({
      // Specify the type of content in this collection
      type: 'page',
      // Load every file inside the `content` directory
      source: 'solutions/**/*.md',
      schema: z.object({
        title: z.string().min(1, { message: 'Title is required' }),
        description: z.string(),
        releaseDate: z.string().optional(),
        status: z.enum(['waitlist', 'private-beta', 'public-beta', 'general-availability']).default('waitlist'),
      })
    })
  }
})
