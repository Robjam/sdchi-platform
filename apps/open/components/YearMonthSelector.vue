<script setup lang="ts">
type Props = {
  selectedYear: number
  selectedMonth: number
}

type Emits = {
  update: [year: number, month: number]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
const months = [
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' }
]

// AIDEV-NOTE: Handle year/month changes and emit combined update event
const handleYearChange = (event: Event) => {
  const year = parseInt((event.target as HTMLSelectElement).value)
  emit('update', year, selectedMonth)
}

const handleMonthChange = (event: Event) => {
  const month = parseInt((event.target as HTMLSelectElement).value)
  emit('update', selectedYear, month)
}
</script>

<template>
  <div class="mb-6 flex gap-4 items-center">
    <div class="flex flex-col">
      <label class="text-sm font-medium mb-1">年</label>
      <select
        :value="selectedYear"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleYearChange">
        <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
      </select>
    </div>

    <div class="flex flex-col">
      <label class="text-sm font-medium mb-1">月</label>
      <select
        :value="selectedMonth"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleMonthChange">
        <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
      </select>
    </div>
  </div>
</template>