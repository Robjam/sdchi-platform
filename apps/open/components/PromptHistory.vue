<script setup lang="ts">
defineProps<{
  items: readonly {
    readonly prompt: string
    readonly response: string
    readonly rating?: number
  }[]
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

const handleClick = (index: number) => {
  emit('select', index)
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
    <div v-for="(item, index) in items" :key="index" @click="() => handleClick(index)"
      class="flex-shrink-0 w-64 p-4 bg-white rounded-lg shadow border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium text-sm truncate">{{ item.prompt }}</h3>
      </div>
      <p class="text-xs text-gray-500 line-clamp-3">{{ item.response }}</p>
      <Rating :value="item.rating" class="flex-shrink-0" />
    </div>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
