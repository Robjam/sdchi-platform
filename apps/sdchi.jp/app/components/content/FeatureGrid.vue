<template>
  <div class="py-12 px-4 md:px-6 bg-white rounded-lg md:rounded-xl border border-primary-200 shadow-sm md:shadow-md">
    <div class="max-w-7xl mx-auto">
      <div class="grid gap-8" :class="{
        'grid-cols-1 md:grid-cols-2': columns === 2,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4
      }">
        <div v-for="(feature, index) in features" :key="index" class="text-center"
          :class="{ 'md:text-center': centerAlign }">

          <div v-if="feature.icon" class="text-4xl mb-4">
            {{ feature.icon }}
          </div>

          <h3 class="text-xl font-semibold mb-3 leading-tight text-primary-800">
            {{ feature.title }}
          </h3>

          <p class="text-base leading-relaxed text-neutral-700">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  title: string
  description: string
  icon?: string
}

interface Props {
  features: Feature[]
  columns?: 2 | 3 | 4
  centerAlign?: boolean
}

withDefaults(defineProps<Props>(), {
  columns: 3,
  centerAlign: true
})
</script>