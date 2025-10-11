export interface ServiceConfig {
  id: string
  name: string
  slug: string
  tagline: string
  logo: string
  colors: {
    primary: string
    secondary: string
    accent?: string
  }
  navigation: Array<{
    name: string
    href: string
  }>
  status: 'waitlist' | 'private-beta' | 'public-beta' | 'general-availability'
}

/**
 * Query services from the solutions content collection.
 * Deduplicates by serviceId to provide unique services.
 */
export async function useServices() {
  const { data: solutions } = await useAsyncData('all-solutions', () =>
    queryCollection('solutions').all()
  )

  // Extract unique services from solutions
  const servicesMap = new Map<string, ServiceConfig>()

  if (solutions.value) {
    for (const solution of solutions.value) {
      if (!servicesMap.has(solution.serviceId)) {
        servicesMap.set(solution.serviceId, {
          id: solution.serviceId,
          name: solution.serviceName,
          slug: solution.serviceSlug,
          tagline: solution.serviceTagline,
          logo: solution.serviceLogo,
          colors: solution.serviceColors,
          navigation: solution.serviceNavigation,
          status: solution.status,
        })
      }
    }
  }

  const services = Array.from(servicesMap.values())

  return {
    services,
    getServiceBySlug: (slug: string) => services.find(s => s.slug === slug),
    getServiceById: (id: string) => services.find(s => s.id === id),
    getActiveServices: () => services.filter(s =>
      s.status === 'waitlist' ||
      s.status === 'private-beta' ||
      s.status === 'public-beta' ||
      s.status === 'general-availability'
    ),
  }
}
