import type { ServiceConfig } from './useServices'

export interface ServiceContext {
  currentService: ServiceConfig | null
  isServicePage: boolean
}

/**
 * Composable to detect and provide current service context
 * Auto-detects service from:
 * 1. Content metadata (serviceId field)
 * 2. Route params
 * 3. Manual override
 */
export async function useServiceContext(serviceOverride?: string | null): Promise<ServiceContext> {
  const route = useRoute()
  const { getServiceById, getServiceBySlug } = await useServices()

  // Priority 1: Manual override
  if (serviceOverride) {
    const service = getServiceById(serviceOverride) || getServiceBySlug(serviceOverride)
    return {
      currentService: service || null,
      isServicePage: !!service
    }
  }

  // Priority 2: Check if we're on a solutions/landing page and get service from content
  const nuxtApp = useNuxtApp()
  const pageData = nuxtApp.payload.data?.[route.params.landing as string]
  const pageServiceId = pageData?.serviceId

  if (pageServiceId) {
    const service = getServiceById(pageServiceId)
    return {
      currentService: service || null,
      isServicePage: !!service
    }
  }

  // Priority 3: Try to detect from route params
  if (route.params.service) {
    const service = getServiceBySlug(route.params.service as string)
    return {
      currentService: service || null,
      isServicePage: !!service
    }
  }

  // Priority 4: Try to extract from route path (e.g., /solutions/open-cafe -> open)
  if (route.path.includes('/solutions/')) {
    const pathParts = route.path.split('/')
    const landingSlug = pathParts[pathParts.length - 1]

    // Extract service slug from landing page slug (e.g., "open-cafe" -> "open")
    if (landingSlug) {
      const potentialServiceSlug = landingSlug.split('-')[0]
      if (potentialServiceSlug) {
        const service = getServiceBySlug(potentialServiceSlug)

        return {
          currentService: service || null,
          isServicePage: !!service
        }
      }
    }
  }

  // Default: No service context (general SDCHI page)
  return {
    currentService: null,
    isServicePage: false
  }
}
