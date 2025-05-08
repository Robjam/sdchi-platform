<script setup lang="ts">
import TimeSlotPicker from './TimeSlotPicker.vue'

// AIDEV-NOTE: Import types from useCalendarDates composable
type TimeSlot = {
  start: string;
  end: string;
}

type OperatingHours = {
  periods: TimeSlot[];
} | null

type WeeklyTemplate = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, OperatingHours>

interface Props {
  modelValue: WeeklyTemplate
}

interface Emits {
  (e: 'update:modelValue', value: WeeklyTemplate): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// AIDEV-NOTE: Local reactive copy for v-model
const localTemplate = ref<WeeklyTemplate>({ ...props.modelValue })

// AIDEV-NOTE: Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localTemplate.value = { ...newValue }
}, { deep: true })

// AIDEV-NOTE: Days configuration for UI display
const daysConfig = [
  { key: 1, name: '月', fullName: '月曜日' },
  { key: 2, name: '火', fullName: '火曜日' },
  { key: 3, name: '水', fullName: '水曜日' },
  { key: 4, name: '木', fullName: '木曜日' },
  { key: 5, name: '金', fullName: '金曜日' },
  { key: 6, name: '土', fullName: '土曜日' },
  { key: 0, name: '日', fullName: '日曜日' },
] as const

const selectedDay = ref<0 | 1 | 2 | 3 | 4 | 5 | 6>(1) // Default to Monday

// AIDEV-NOTE: Quick preset templates
const presets = {
  standard: {
    name: '平日 9:00-17:00',
    template: {
      0: null, // Sunday
      1: { periods: [{ start: '09:00', end: '17:00' }] }, // Monday
      2: { periods: [{ start: '09:00', end: '17:00' }] }, // Tuesday
      3: { periods: [{ start: '09:00', end: '17:00' }] }, // Wednesday
      4: { periods: [{ start: '09:00', end: '17:00' }] }, // Thursday
      5: { periods: [{ start: '09:00', end: '17:00' }] }, // Friday
      6: null, // Saturday
    } as WeeklyTemplate
  },
  retail: {
    name: '小売店 10:00-20:00',
    template: {
      0: { periods: [{ start: '12:00', end: '18:00' }] }, // Sunday
      1: { periods: [{ start: '10:00', end: '20:00' }] }, // Monday
      2: { periods: [{ start: '10:00', end: '20:00' }] }, // Tuesday
      3: { periods: [{ start: '10:00', end: '20:00' }] }, // Wednesday
      4: { periods: [{ start: '10:00', end: '20:00' }] }, // Thursday
      5: { periods: [{ start: '10:00', end: '20:00' }] }, // Friday
      6: { periods: [{ start: '10:00', end: '20:00' }] }, // Saturday
    } as WeeklyTemplate
  },
  restaurant: {
    name: 'レストラン 分割営業',
    template: {
      0: null, // Sunday
      1: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      2: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      3: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      4: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      5: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      6: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
    } as WeeklyTemplate
  }
}

const emitUpdate = () => {
  emit('update:modelValue', { ...localTemplate.value })
}

const toggleDayOpen = (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  if (localTemplate.value[day] === null) {
    // Open the day with default hours
    localTemplate.value[day] = { periods: [{ start: '09:00', end: '17:00' }] }
  } else {
    // Close the day
    localTemplate.value[day] = null
  }
  emitUpdate()
}

const addTimeSlot = (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  if (localTemplate.value[day] === null) {
    localTemplate.value[day] = { periods: [] }
  }
  
  const lastPeriod = localTemplate.value[day]!.periods[localTemplate.value[day]!.periods.length - 1]
  const newStart = lastPeriod ? lastPeriod.end : '09:00'
  const newEnd = lastPeriod ? 
    (parseInt(lastPeriod.end.split(':')[0]) < 23 ? 
      `${String(parseInt(lastPeriod.end.split(':')[0]) + 1).padStart(2, '0')}:00` : 
      '23:59') : 
    '17:00'
  
  localTemplate.value[day]!.periods.push({ start: newStart, end: newEnd })
  emitUpdate()
}

const removeTimeSlot = (day: 0 | 1 | 2 | 3 | 4 | 5 | 6, index: number) => {
  if (localTemplate.value[day] && localTemplate.value[day]!.periods.length > index) {
    localTemplate.value[day]!.periods.splice(index, 1)
    if (localTemplate.value[day]!.periods.length === 0) {
      localTemplate.value[day] = null
    }
    emitUpdate()
  }
}

const updateTimeSlot = (day: 0 | 1 | 2 | 3 | 4 | 5 | 6, index: number, timeSlot: TimeSlot) => {
  if (localTemplate.value[day] && localTemplate.value[day]!.periods.length > index) {
    localTemplate.value[day]!.periods[index] = timeSlot
    emitUpdate()
  }
}

const applyPreset = (presetKey: keyof typeof presets) => {
  localTemplate.value = { ...presets[presetKey].template }
  emitUpdate()
}

const copyDayHours = (fromDay: 0 | 1 | 2 | 3 | 4 | 5 | 6, toDay: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  if (localTemplate.value[fromDay] === null) {
    localTemplate.value[toDay] = null
  } else {
    localTemplate.value[toDay] = {
      periods: [...localTemplate.value[fromDay]!.periods]
    }
  }
  emitUpdate()
}

const isDayOpen = (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => localTemplate.value[day] !== null
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header with presets -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">営業時間設定</h3>
      <div class="mt-3 flex flex-wrap gap-2">
        <span class="text-sm text-gray-500">プリセット:</span>
        <button
          v-for="(preset, key) in presets"
          :key="key"
          @click="applyPreset(key)"
          type="button"
          class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <!-- Day tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 px-6" aria-label="Tabs">
        <button
          v-for="day in daysConfig"
          :key="day.key"
          @click="selectedDay = day.key"
          :class="[
            selectedDay === day.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ day.name }}
          <span
            v-if="!isDayOpen(day.key)"
            class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            休
          </span>
        </button>
      </nav>
    </div>

    <!-- Day configuration -->
    <div class="p-6">
      <div v-for="day in daysConfig" :key="day.key" v-show="selectedDay === day.key">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-medium text-gray-900">{{ day.fullName }}</h4>
          <div class="flex items-center gap-3">
            <label class="flex items-center">
              <input
                :checked="isDayOpen(day.key)"
                @change="toggleDayOpen(day.key)"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">営業</span>
            </label>
          </div>
        </div>

        <div v-if="isDayOpen(day.key)" class="space-y-3">
          <!-- Time slots -->
          <div v-for="(period, index) in localTemplate[day.key]!.periods" :key="index">
            <TimeSlotPicker
              :model-value="period"
              :label="`時間帯 ${index + 1}`"
              @update:model-value="updateTimeSlot(day.key, index, $event)"
              @remove="removeTimeSlot(day.key, index)"
            />
          </div>

          <!-- Add time slot button -->
          <button
            @click="addTimeSlot(day.key)"
            type="button"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            時間帯を追加
          </button>

          <!-- Copy from other days -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-2">他の曜日からコピー:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="otherDay in daysConfig.filter(d => d.key !== day.key)"
                :key="otherDay.key"
                @click="copyDayHours(otherDay.key, day.key)"
                :disabled="!isDayOpen(otherDay.key)"
                type="button"
                class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {{ otherDay.name }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          この日は休業日です
        </div>
      </div>
    </div>
  </div>
</template>