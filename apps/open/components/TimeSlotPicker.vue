<script setup lang="ts">
interface TimeSlot {
  start: string
  end: string
}

interface Props {
  modelValue: TimeSlot
  label?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: TimeSlot): void
  (e: 'remove'): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Time Slot',
  disabled: false
})

const emit = defineEmits<Emits>()

// AIDEV-NOTE: Local reactive copies for v-model binding on individual inputs
const startTime = ref(props.modelValue.start)
const endTime = ref(props.modelValue.end)

// AIDEV-NOTE: Watch for external prop changes to update local state
watch(() => props.modelValue, (newValue) => {
  startTime.value = newValue.start
  endTime.value = newValue.end
}, { deep: true })

// AIDEV-NOTE: Emit updates when local values change, with validation
const updateTimeSlot = () => {
  const newTimeSlot = {
    start: startTime.value,
    end: endTime.value
  }
  
  // Basic validation: end time should be after start time
  if (startTime.value && endTime.value && startTime.value >= endTime.value) {
    // If end is not after start, adjust end time
    const startHour = parseInt(startTime.value.split(':')[0])
    const startMinute = parseInt(startTime.value.split(':')[1])
    const adjustedEnd = startHour === 23 ? '23:59' : `${String(startHour + 1).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`
    newTimeSlot.end = adjustedEnd
    endTime.value = adjustedEnd
  }
  
  emit('update:modelValue', newTimeSlot)
}

watch(startTime, updateTimeSlot)
watch(endTime, updateTimeSlot)

const isValidTimeSlot = computed(() => {
  if (!startTime.value || !endTime.value) return false
  return startTime.value < endTime.value
})
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div class="flex-1">
      <label class="block text-xs font-medium text-gray-700 mb-1">{{ label }}</label>
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <input
            v-model="startTime"
            type="time"
            :disabled="disabled"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Start time"
          />
        </div>
        <span class="text-gray-500 text-sm">–</span>
        <div class="flex-1">
          <input
            v-model="endTime"
            type="time"
            :disabled="disabled"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="End time"
          />
        </div>
      </div>
      <div v-if="!isValidTimeSlot && startTime && endTime" class="mt-1 text-xs text-red-600">
        End time must be after start time
      </div>
    </div>
    <button
      v-if="!disabled"
      @click="emit('remove')"
      type="button"
      class="p-2 text-gray-400 hover:text-red-600 transition-colors"
      title="Remove time slot"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>