<template>
  <div class="relative -mx-2 md:mx-0 md:rounded-xl overflow-hidden md:shadow-md">
    <div v-if="image" class="absolute inset-0 z-0">
      <img :src="image" :alt="title" class="w-full h-full object-cover" />
    </div>

    <div class="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center bg-neutral-900/40 md:bg-gradient-to-br md:from-neutral-900/30 md:via-neutral-900/40 md:to-neutral-900/30">
      <h1 class="text-white text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg">{{ title }}</h1>
      <p v-if="subtitle" class="text-xl md:text-2xl text-white mt-6 max-w-3xl mx-auto leading-relaxed drop-shadow-md" v-html="subtitle"></p>
      <div v-if="$slots.default" class="mt-8 max-w-2xl mx-auto text-white text-base md:text-lg leading-relaxed drop-shadow-md">
        <Slot :use="$slots.default" unwrap="p" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  image?: string
  alignment?: 'left' | 'center' | 'right'
  backgroundColor?: string
}

withDefaults(defineProps<Props>(), {
  alignment: 'center'
})
</script>