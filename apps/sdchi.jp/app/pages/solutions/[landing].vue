<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 via-white to-secondary-100">
    <!-- Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-2 md:px-4 py-0 md:py-16">
      <ContentRenderer v-if="page" :value="page" class="prose prose-lg prose-neutral max-w-none flex flex-col gap-8
         prose-headings:text-transparent prose-headings:bg-gradient-to-r prose-headings:from-primary-600 prose-headings:via-secondary-600 prose-headings:to-primary-500 prose-headings:bg-clip-text
         prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-bold
         prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12
         prose-h3:text-2xl prose-h3:font-semibold
         prose-p:text-neutral-700 prose-p:leading-relaxed
         prose-a:text-primary-600 prose-a:hover:text-primary-700
         prose-strong:text-primary-900 prose-strong:font-semibold
         prose-li:marker:text-primary-500" />
      <div v-else class="text-center text-neutral-900">
        <p class="text-2xl font-semibold">ページが見つかりません
        </p>
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

// TODO: set layout to be the public one
definePageMeta({
  layout: 'public'
})

</script>
