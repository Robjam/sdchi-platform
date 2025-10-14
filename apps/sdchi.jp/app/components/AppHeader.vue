<template>
  <header class="bg-primary-500 shadow-sm">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 lg:px-8 lg:py-3" aria-label="Global">
      <!-- Left: SDCHI Brand + Service Indicator -->
      <div class="flex lg:flex-1 items-center gap-3">
        <a href="/" class="flex items-center gap-2">
          <span class="text-white text-xl font-bold">SDCHI</span>
        </a>

        <!-- Service Badge/Indicator (only shown on service pages) -->
        <div v-if="serviceContext.isServicePage && serviceContext.currentService"
          class="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/20">
          <img :src="serviceContext.currentService.logo" :alt="serviceContext.currentService.name" class="h-6 w-auto" />
          <span class="text-white text-sm font-medium hidden md:inline">{{
            serviceContext.currentService.name.split(' ')[1] }}</span>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="flex lg:hidden">
        <button type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-primary-100 hover:text-white"
          @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <svg class="size-7" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:gap-x-12">
        <a v-for="item in activeNavigation" :key="item.name" :href="item.href"
          class="text-sm/6 font-semibold text-white hover:text-primary-50 transition-colors">
          {{ item.name }}
        </a>
      </div>

      <!-- Right: Login -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm/6 font-semibold text-white hover:text-primary-50 transition-colors">
          ログイン
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </nav>

    <!-- Mobile menu overlay -->
    <Teleport to="body">
      <div v-if="mobileMenuOpen" class="lg:hidden">
        <!-- Background overlay -->
        <div class="fixed inset-0 z-40 bg-neutral-900/50" @click="mobileMenuOpen = false"></div>

        <!-- Menu panel -->
        <div
          class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-neutral-300">
          <!-- Mobile menu header -->
          <div
            class="sticky top-0 z-10 bg-primary-500 flex items-center justify-between px-4 py-1 border-b border-primary-600">
            <a href="/" class="flex items-center gap-2" @click="mobileMenuOpen = false">
              <span class="text-white text-xl font-bold">SDCHI</span>
              <img v-if="serviceContext.isServicePage && serviceContext.currentService"
                :src="serviceContext.currentService.logo" :alt="serviceContext.currentService.name" class="h-8 w-auto" />
            </a>
            <button type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-primary-100 hover:text-white"
              @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <svg class="size-7" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Mobile menu content -->
          <div class="flow-root p-6">
            <div class="-my-6 divide-y divide-neutral-200">
              <!-- Service indicator (mobile) -->
              <div v-if="serviceContext.isServicePage && serviceContext.currentService" class="py-4">
                <div class="flex items-center gap-2 text-sm text-neutral-600">
                  <span class="font-medium text-neutral-900">{{ serviceContext.currentService.name }}</span>
                  <span
                    class="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">{{ getStatusLabel(serviceContext.currentService.status) }}</span>
                </div>
              </div>

              <!-- Navigation items -->
              <div class="space-y-2 py-6">
                <a v-for="item in activeNavigation" :key="item.name" :href="item.href"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-neutral-900 hover:bg-primary-50"
                  @click="mobileMenuOpen = false">
                  {{ item.name }}
                </a>
              </div>

              <!-- Services section (if on general page) -->
              <div v-if="!serviceContext.isServicePage && allServices.length > 0" class="py-6">
                <div class="text-sm font-medium text-neutral-500 mb-3 px-3">サービス</div>
                <a v-for="service in allServices" :key="service.id" :href="`/solutions/${service.slug}-cafe`"
                  class="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-primary-50"
                  @click="mobileMenuOpen = false">
                  <img :src="service.logo" :alt="service.name" class="h-6 w-auto" />
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-neutral-900">{{ service.name }}</div>
                    <div class="text-xs text-neutral-600">{{ service.tagline }}</div>
                  </div>
                </a>
              </div>

              <!-- Login -->
              <div class="py-6">
                <a href="#"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-neutral-900 hover:bg-primary-50"
                  @click="mobileMenuOpen = false">
                  ログイン
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { generalNavigation } from '~/config/services'

const props = defineProps<{
  serviceId?: string | null
}>()

const serviceContext = await useServiceContext(props.serviceId)
const { getActiveServices } = await useServices()
const allServices = getActiveServices()
const mobileMenuOpen = ref(false)

// Determine active navigation based on context
const activeNavigation = computed(() => {
  if (serviceContext.isServicePage && serviceContext.currentService) {
    return serviceContext.currentService.navigation
  }
  return generalNavigation
})

// Lock/unlock scroll when mobile menu opens/closes
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'active': '利用可能',
    'beta': 'ベータ版',
    'waitlist': 'ウェイトリスト',
    'coming-soon': '近日公開'
  }
  return labels[status] || status
}
</script>
