<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  value?: number
  onChange?: (rating: number) => void
}>()

const hoverRating = ref(0)
const handleClick = (rating: number) => {
  if (props.onChange) {
    props.onChange(rating)
  }
}

const setHoverRating = (rating: number) => {
  hoverRating.value = rating
}

const clearHoverRating = () => {
  hoverRating.value = 0
}

const getStarColor = (index: number) => {
  if (hoverRating.value > 0) {
    return index <= hoverRating.value ? 'text-open-300' : 'text-gray-400'
  }
  return props.value && index <= props.value ? 'text-open-300' : 'text-gray-400'
}
</script>

<template>
  <div class="flex gap-1">
    <button v-for="i in [1, 2, 3, 4, 5]" :key="i" @click="() => handleClick(i)" @mouseenter="() => setHoverRating(i)"
      @mouseleave="clearHoverRating" class="transition-colors duration-100" :class="getStarColor(i)"
      aria-label="この回答を評価">
      ★
    </button>
  </div>
</template>
