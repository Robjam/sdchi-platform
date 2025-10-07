<template>
  <header class="bg-primary-500 shadow-sm">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 lg:px-8 lg:py-3" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-2">
          <span class="text-white text-xl font-bold">SDCHI</span>
          <img class="h-8 w-auto" src="/OPEN_logo.svg" alt="OPEN" />
        </a>
      </div>
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
      <div class="hidden lg:flex lg:gap-x-12">
        <a v-for="item in navigation" :key="item.name" :href="item.href" class="text-sm/6 font-semibold text-white">{{
          item.name }}</a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm/6 font-semibold text-white">Log in <span aria-hidden="true">&rarr;</span></a>
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
          <div
            class="sticky top-0 z-10 bg-primary-500 flex items-center justify-between px-4 py-1 border-b border-primary-600">
            <a href="/" class="flex items-center gap-2" @click="mobileMenuOpen = false">
              <span class="text-white text-xl font-bold">SDCHI</span>
              <img class="h-8 w-auto" src="/OPEN_logo.svg" alt="OPEN" />
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
          <div class="flow-root p-6">
            <div class="-my-6 divide-y divide-neutral-200">
              <div class="space-y-2 py-6">
                <a v-for="item in navigation" :key="item.name" :href="item.href"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-neutral-900 hover:bg-primary-50">{{
                    item.name }}</a>
              </div>
              <div class="py-6">
                <a href="#"
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-neutral-900 hover:bg-primary-50">Log
                  in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
  <slot />
</template>

<script setup>
import { ref, watch } from 'vue'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

const mobileMenuOpen = ref(false)

// Lock/unlock scroll when mobile menu opens/closes
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>