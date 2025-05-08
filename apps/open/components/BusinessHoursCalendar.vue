<script setup lang="ts">
import { Qalendar } from 'qalendar'

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
  weeklyTemplate: WeeklyTemplate
  selectedYear?: number
  selectedMonth?: number
  viewMode?: 'month' | 'week'
}

const props = withDefaults(defineProps<Props>(), {
  selectedYear: () => new Date().getFullYear(),
  selectedMonth: () => new Date().getMonth() + 1, // 1-based month
  viewMode: 'month'
})

// AIDEV-NOTE: Convert weekly template to qalendar events for the selected month
const calendarEvents = computed(() => {
  const events: Array<{
    id: string
    title: string
    time: { start: string; end: string }
    color: string
    isEditable: boolean
  }> = []

  // Generate events for the entire month
  const daysInMonth = new Date(props.selectedYear, props.selectedMonth, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.selectedYear, props.selectedMonth - 1, day)
    const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const dateString = `${props.selectedYear}-${props.selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    const operatingHours = props.weeklyTemplate[dayOfWeek]
    
    if (operatingHours && operatingHours.periods.length > 0) {
      // Create an event for each time period
      operatingHours.periods.forEach((period, index) => {
        events.push({
          id: `${dateString}-${index}`,
          title: index === 0 ? '営業時間' : `営業時間 ${index + 1}`,
          time: {
            start: `${dateString} ${period.start}`,
            end: `${dateString} ${period.end}`
          },
          color: 'green',
          isEditable: false
        })
      })
    } else {
      // Add a closed event for visual clarity
      events.push({
        id: `${dateString}-closed`,
        title: '休業日',
        time: {
          start: `${dateString} 00:00`,
          end: `${dateString} 23:59`
        },
        color: 'gray',
        isEditable: false
      })
    }
  }
  
  return events
})

// AIDEV-NOTE: Qalendar configuration
const calendarConfig = computed(() => ({
  week: {
    startsOn: 'monday' as const,
    nDays: props.viewMode === 'week' ? 7 : undefined
  },
  locale: 'ja-JP',
  defaultMode: props.viewMode,
  style: {
    colorSchemes: {
      green: {
        color: '#10b981',
        backgroundColor: '#d1fae5'
      },
      gray: {
        color: '#6b7280',
        backgroundColor: '#f3f4f6'
      }
    }
  },
  showCurrentTime: true,
  dayBoundaries: {
    start: 6,
    end: 24
  }
}))

// AIDEV-NOTE: Day names in Japanese for display
const dayNames = {
  0: '日曜日',
  1: '月曜日', 
  2: '火曜日',
  3: '水曜日',
  4: '木曜日',
  5: '金曜日',
  6: '土曜日'
}

// AIDEV-NOTE: Summary of business hours for current view
const businessHoursSummary = computed(() => {
  const summary: Array<{ day: string; hours: string; isOpen: boolean }> = []
  
  Object.entries(dayNames).forEach(([dayKey, dayName]) => {
    const day = parseInt(dayKey) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const operatingHours = props.weeklyTemplate[day]
    
    if (operatingHours && operatingHours.periods.length > 0) {
      const hoursText = operatingHours.periods
        .map(period => `${period.start}-${period.end}`)
        .join(', ')
      summary.push({
        day: dayName,
        hours: hoursText,
        isOpen: true
      })
    } else {
      summary.push({
        day: dayName,
        hours: '休業',
        isOpen: false
      })
    }
  })
  
  return summary
})

const emit = defineEmits<{
  (e: 'monthChanged', year: number, month: number): void
  (e: 'viewModeChanged', mode: 'month' | 'week'): void
}>()

const handleMonthChange = (direction: 'prev' | 'next') => {
  let newYear = props.selectedYear
  let newMonth = props.selectedMonth
  
  if (direction === 'next') {
    newMonth++
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }
  } else {
    newMonth--
    if (newMonth < 1) {
      newMonth = 12
      newYear--
    }
  }
  
  emit('monthChanged', newYear, newMonth)
}

const handleViewModeChange = (mode: 'month' | 'week') => {
  emit('viewModeChanged', mode)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">営業カレンダー</h3>
        <div class="flex items-center gap-3">
          <!-- View mode toggle -->
          <div class="flex rounded-md shadow-sm">
            <button
              @click="handleViewModeChange('month')"
              :class="[
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                'px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300'
              ]"
            >
              月
            </button>
            <button
              @click="handleViewModeChange('week')"
              :class="[
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                'px-3 py-2 text-sm font-medium rounded-r-md border-l-0 border border-gray-300'
              ]"
            >
              週
            </button>
          </div>
          
          <!-- Month navigation -->
          <div class="flex items-center gap-2">
            <button
              @click="handleMonthChange('prev')"
              class="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span class="text-lg font-semibold text-gray-900">
              {{ selectedYear }}年{{ selectedMonth }}月
            </span>
            <button
              @click="handleMonthChange('next')"
              class="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="p-6">
      <ClientOnly>
        <Qalendar
          :events="calendarEvents"
          :config="calendarConfig"
          :selected-date="new Date(selectedYear, selectedMonth - 1, 1)"
        />
        <template #fallback>
          <div class="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-500">カレンダーを読み込み中...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Business hours summary -->
    <div class="px-6 pb-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">週間営業時間</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="item in businessHoursSummary"
          :key="item.day"
          :class="[
            item.isOpen 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-gray-50 border-gray-200 text-gray-600',
            'px-3 py-2 rounded-lg border text-sm'
          ]"
        >
          <div class="font-medium">{{ item.day }}</div>
          <div class="text-xs">{{ item.hours }}</div>
        </div>
      </div>
    </div>
  </div>
</template>