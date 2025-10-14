<template>
  <footer class="bg-neutral-900 text-neutral-300">
    <div class="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- SDCHI Brand Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-white text-2xl font-bold">SDCHI</span>
          </div>
          <p class="text-sm text-neutral-400 leading-relaxed">
            日本のテクノロジーイノベーションを支える、次世代のビジネスソリューション
          </p>
          <!-- Social Links -->
          <div class="flex gap-4 pt-2">
            <a v-for="social in socialLinks" :key="social.name" :href="social.href"
              class="text-neutral-400 hover:text-white transition-colors" :aria-label="social.name">
              <svg v-if="social.icon === 'twitter'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <svg v-else-if="social.icon === 'github'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else-if="social.icon === 'linkedin'" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Services Section -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">サービス</h3>
          <ul class="space-y-3">
            <li v-for="service in activeServices" :key="service.id">
              <a :href="`/solutions/${service.slug}-cafe`"
                class="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                <img :src="service.logo" :alt="service.name" class="h-4 w-auto opacity-75 group-hover:opacity-100" />
                <span>{{ service.name }}</span>
                <span v-if="service.status !== 'active'"
                  class="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded">
                  {{ getStatusLabel(service.status) }}
                </span>
              </a>
            </li>
            <li v-if="activeServices.length === 0">
              <span class="text-sm text-neutral-500">近日公開</span>
            </li>
          </ul>
        </div>

        <!-- Company Section -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">{{ companySection.title }}</h3>
          <ul class="space-y-3">
            <li v-for="link in companySection.links" :key="link.name">
              <a :href="link.href" class="text-sm hover:text-white transition-colors">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal Section -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">{{ legalSection.title }}</h3>
          <ul class="space-y-3">
            <li v-for="link in legalSection.links" :key="link.name">
              <a :href="link.href" class="text-sm hover:text-white transition-colors">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-neutral-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-neutral-500">
            &copy; {{ currentYear }} SDCHI. All rights reserved.
          </p>
          <div class="flex gap-4 text-sm">
            <!-- Language selector placeholder -->
            <button class="text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              日本語
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { footerSections } from '~/config/services'

const { getActiveServices } = await useServices()
const activeServices = getActiveServices()
const companySection = footerSections.company
const legalSection = footerSections.legal
const socialLinks = footerSections.social

const currentYear = computed(() => new Date().getFullYear())

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'beta': 'ベータ',
    'waitlist': 'ウェイトリスト',
    'coming-soon': '近日'
  }
  return labels[status] || status
}
</script>
