<script setup lang="ts">
export type Props = {
  image?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  reverseMobile?: boolean
}

withDefaults(defineProps<Props>(), {
  imagePosition: 'left'
})
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center bg-white rounded-lg md:rounded-xl border border-primary-200 shadow-sm md:shadow-md overflow-hidden" :class="{
    'lg:flex-row-reverse': imagePosition === 'right',
  }">
    <div class="order-2 py-8 px-4 md:px-6 lg:py-12 lg:px-12" :class="{
      'lg:order-1': imagePosition === 'right',
      'lg:order-2': imagePosition === 'left'
    }">
      <slot />
    </div>

    <div v-if="image" class="order-1" :class="{
      'lg:order-2': imagePosition === 'right',
      'lg:order-1': imagePosition === 'left'
    }">
      <img :src="image" :alt="imageAlt || 'Feature illustration'" class="w-full h-auto rounded-t-lg lg:rounded-none border-b lg:border-0 border-primary-200" />
    </div>
  </div>
</template>
