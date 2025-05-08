<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

useHead({
  bodyAttrs: {
    class: 'h-full bg-white',
  },
  htmlAttrs: {
    class: 'h-full',
  },
})

const navigation = [
  { name: 'カレンダー', href: '/calendars' },
  { name: '営業時間', href: '/hours' },
  { name: '設定', href: '/settings' },
]

const sidebarOpen = ref(false)
const { profile, loading } = useUserProfile()
</script>

<template>
  <div class="min-h-full">
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-200" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-200" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-open-900/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild as="template" enter="transition ease-in-out duration-200 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-200 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-1">
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-open-50 px-6 pb-4 shadow-lg">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto" src="/OPEN_logo.svg" alt="OPEN" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-2">
                    <li v-for="item in navigation" :key="item.name">
                      <NuxtLink :to="item.href"
                        class="text-open-600 hover:bg-open-50 hover:text-open-700 group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors"
                        active-class="bg-open-100 text-open-600" exact-active-class="bg-open-100 text-open-600"
                        @click="sidebarOpen = false">
                        {{ item.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                  <!-- User Profile Section - Mobile -->
                  <div v-if="!loading && profile" class="mt-auto border-t border-open-200 pt-4">
                    <div class="flex items-center gap-x-3 px-3 py-2">
                      <div v-if="profile.picture" class="h-8 w-8 flex-shrink-0">
                        <img class="h-8 w-8 rounded-full object-cover" :src="profile.picture"
                          :alt="profile.name || 'プロフィール画像'" />
                      </div>
                      <div v-else
                        class="h-8 w-8 flex-shrink-0 rounded-full bg-open-500 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">{{ (profile.name || profile.email ||
                          'U')[0].toUpperCase() }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-open-900 truncate">{{ profile.name || profile.email || 'ユーザー'
                        }}</p>
                        <p v-if="profile.name && profile.email" class="text-xs text-open-500 truncate">{{ profile.email
                        }}</p>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Desktop sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-open-200 lg:bg-open-50">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="/OPEN_logo.svg" alt="OPEN" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-2">
            <li v-for="item in navigation" :key="item.name">
              <NuxtLink :to="item.href" :class="[
                item.current
                  ? 'bg-open-100 text-open-600'
                  : 'text-open-600 hover:bg-open-50 hover:text-open-700',
                'group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors'
              ]">
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
          <!-- User Profile Section - Desktop -->
          <div v-if="!loading && profile" class="mt-auto border-t border-open-200 pt-4">
            <div class="flex items-center gap-x-3 px-3 py-3">
              <div v-if="profile.picture" class="h-10 w-10 flex-shrink-0">
                <img class="h-10 w-10 rounded-full object-cover" :src="profile.picture"
                  :alt="profile.name || 'プロフィール画像'" />
              </div>
              <div v-else class="h-10 w-10 flex-shrink-0 rounded-full bg-open-500 flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ (profile.name || profile.email || 'U')[0].toUpperCase()
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-open-900 truncate">{{ profile.name || profile.email || 'ユーザー' }}</p>
                <p v-if="profile.name && profile.email" class="text-xs text-open-500 truncate">{{ profile.email }}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- Mobile header -->
    <div class="sticky top-0 z-30 flex items-center gap-x-4 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-open-600 lg:hidden" @click="sidebarOpen = true">
        <span class="sr-only">サイドバーを開く</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="flex-1 text-sm font-semibold text-open-900">ダッシュボード</div>
    </div>

    <!-- Main content -->
    <main class="lg:pl-64">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
