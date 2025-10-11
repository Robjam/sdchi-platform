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
        // Service metadata - makes each solution self-contained
        serviceId: z.string(),
        serviceName: z.string(),
        serviceSlug: z.string(),
        serviceTagline: z.string(),
        serviceLogo: z.string(),
        serviceColors: z.object({
          primary: z.string(),
          secondary: z.string(),
          accent: z.string().optional(),
        }),
        serviceNavigation: z.array(z.object({
          name: z.string(),
          href: z.string(),
        })),
      })
    })
  }
})
