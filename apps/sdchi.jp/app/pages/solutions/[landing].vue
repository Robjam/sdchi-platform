<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 via-white to-secondary-100">
    <!-- Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-2 md:px-4 py-0 md:py-16">
      <ContentRenderer v-if="page" :value="page" :data="{ service: (page as any)?.serviceId }" class="prose prose-lg prose-neutral max-w-none flex flex-col gap-8
         prose-headings:text-transparent prose-headings:bg-gradient-to-r prose-headings:from-primary-600 prose-headings:via-secondary-600 prose-headings:to-primary-500 prose-headings:bg-clip-text
         prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-bold
         prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12
         prose-h3:text-2xl prose-h3:font-semibold
         prose-p:text-neutral-700 prose-p:leading-relaxed
         prose-a:text-primary-600 prose-a:hover:text-primary-700
         prose-strong:text-primary-900 prose-strong:font-semibold
         prose-li:marker:text-primary-500" />

      <!-- 404 State -->
      <div v-else class="py-12 md:py-20">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="text-6xl font-bold text-primary-300 mb-4">404</div>
          <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            ページが見つかりません
          </h1>
          <p class="text-lg text-neutral-600 mb-8">
            お探しのソリューションページは存在しないか、移動された可能性があります。<br>
            以下のサービスをご覧ください。
          </p>
          <a href="/" class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームに戻る
          </a>
        </div>

        <!-- Services Grid -->
        <div v-if="availableServices.length > 0" class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-neutral-900 text-center mb-8">
            利用可能なサービス
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              v-for="service in availableServices"
              :key="service.id"
              :href="`/solutions/${service.slug}-cafe`"
              class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-neutral-200 hover:border-primary-300"
            >
              <div class="flex items-start gap-4">
                <img :src="service.logo" :alt="service.name" class="h-12 w-auto flex-shrink-0" />
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
                    {{ service.name }}
                  </h3>
                  <p class="text-neutral-600 mb-3">{{ service.tagline }}</p>
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(service.status)"
                    >
                      {{ getStatusLabel(service.status) }}
                    </span>
                    <span class="text-sm text-primary-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      詳しく見る
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.params.landing as string, async () => {
  const result = await queryCollection('solutions').path(`/solutions/${(route.params.landing as string).replace('-', '/')}`).first()
  return result
})

// Set 404 status if page not found
if (!page.value) {
  setResponseStatus(useRequestEvent()!, 404)
}

// Get available services for 404 display
const { getActiveServices } = await useServices()
const availableServices = getActiveServices()

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'waitlist': 'ウェイトリスト',
    'private-beta': 'プライベートベータ',
    'public-beta': 'パブリックベータ',
    'general-availability': '利用可能'
  }
  return labels[status] || status
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'waitlist': 'bg-amber-100 text-amber-700',
    'private-beta': 'bg-blue-100 text-blue-700',
    'public-beta': 'bg-indigo-100 text-indigo-700',
    'general-availability': 'bg-green-100 text-green-700'
  }
  return classes[status] || 'bg-neutral-100 text-neutral-700'
}

definePageMeta({
  layout: 'public'
})

</script>
