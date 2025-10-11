<template>
  <AppHeader :service-id="serviceId" />
  <slot />
  <AppFooter />
</template>

<script setup lang="ts">
// Get service context from the page if available
const route = useRoute()
const nuxtApp = useNuxtApp()

// Try to get service ID from page data
const serviceId = computed(() => {
  const pageData = nuxtApp.payload.data?.[route.params.landing as string]
  return pageData?.service || null
})
</script>