<script setup lang="ts">
import WeeklyScheduleForm from '~/components/WeeklyScheduleForm.vue'
import BusinessHoursCalendar from '~/components/BusinessHoursCalendar.vue'


definePageMeta({
  layout: 'sidebar',
})


// AIDEV-NOTE: Import types from useCalendarDates composable for consistency  
type TimeSlot = {
  start: string;
  end: string;
}

type OperatingHours = {
  periods: TimeSlot[];
} | null

type WeeklyTemplate = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, OperatingHours>

interface BusinessHoursTemplate {
  id: string
  name: string
  isDefault: boolean
  weeklyTemplate: WeeklyTemplate
  createdAt: number
  updatedAt: number
}

// AIDEV-NOTE: Reactive state management
const currentTemplate = ref<WeeklyTemplate>({
  0: null, // Sunday
  1: { periods: [{ start: '09:00', end: '17:00' }] }, // Monday
  2: { periods: [{ start: '09:00', end: '17:00' }] }, // Tuesday
  3: { periods: [{ start: '09:00', end: '17:00' }] }, // Wednesday
  4: { periods: [{ start: '09:00', end: '17:00' }] }, // Thursday
  5: { periods: [{ start: '09:00', end: '17:00' }] }, // Friday
  6: null  // Saturday
})

const templateName = ref('営業時間')
const selectedTemplateId = ref<string | null>(null)
const availableTemplates = ref<BusinessHoursTemplate[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const message = ref<{ type: 'success' | 'error', text: string } | null>(null)

// Calendar state
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth() + 1)
const calendarViewMode = ref<'month' | 'week'>('month')

// AIDEV-NOTE: Load user's business hours on component mount
const loadBusinessHours = async () => {
  isLoading.value = true
  try {
    const { data } = await $fetch<{
      templates: BusinessHoursTemplate[]
      hasDefault: boolean
    }>('/api/business-hours')

    availableTemplates.value = data.templates || []

    // Load default template if available
    const defaultTemplate = data.templates?.find(t => t.isDefault)
    if (defaultTemplate) {
      currentTemplate.value = defaultTemplate.weeklyTemplate
      templateName.value = defaultTemplate.name
      selectedTemplateId.value = defaultTemplate.id
    } else if (!data.hasDefault) {
      // Load system default if user has no templates
      const { data: defaults } = await $fetch<{
        templates: Record<string, { name: string, weeklyTemplate: WeeklyTemplate }>
        recommended: string
      }>('/api/business-hours/default')

      const recommended = defaults.templates[defaults.recommended]
      if (recommended) {
        currentTemplate.value = recommended.weeklyTemplate
        templateName.value = recommended.name
      }
    }
  } catch (error) {
    console.error('Error loading business hours:', error)
    showMessage('error', '営業時間の読み込みに失敗しました')
  } finally {
    isLoading.value = false
  }
}

// AIDEV-NOTE: Save business hours template
const saveBusinessHours = async () => {
  isSaving.value = true
  try {
    const payload = {
      id: selectedTemplateId.value,
      name: templateName.value,
      weeklyTemplate: currentTemplate.value,
      isDefault: true
    }

    const { data } = await $fetch<{ id: string, message: string }>('/api/business-hours', {
      method: 'POST',
      body: payload
    })

    if (!selectedTemplateId.value) {
      selectedTemplateId.value = data.id
    }

    showMessage('success', '営業時間を保存しました')
    await loadBusinessHours() // Reload to get updated templates
  } catch (error) {
    console.error('Error saving business hours:', error)
    showMessage('error', '営業時間の保存に失敗しました')
  } finally {
    isSaving.value = false
  }
}

// AIDEV-NOTE: Load template from dropdown
const loadTemplate = (template: BusinessHoursTemplate) => {
  currentTemplate.value = template.weeklyTemplate
  templateName.value = template.name
  selectedTemplateId.value = template.id
  showMessage('success', `"${template.name}" を読み込みました`)
}

// AIDEV-NOTE: Create new template
const createNewTemplate = () => {
  selectedTemplateId.value = null
  templateName.value = '新しい営業時間'
  // Keep current template as starting point
  showMessage('success', '新しいテンプレートを作成中です')
}

// AIDEV-NOTE: Utility functions
const showMessage = (type: 'success' | 'error', text: string) => {
  message.value = { type, text }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

const hasUnsavedChanges = computed(() => {
  if (!selectedTemplateId.value) return true
  const current = availableTemplates.value.find(t => t.id === selectedTemplateId.value)
  if (!current) return true
  return JSON.stringify(current.weeklyTemplate) !== JSON.stringify(currentTemplate.value) ||
    current.name !== templateName.value
})

// AIDEV-NOTE: Load data on mount
onMounted(() => {
  loadBusinessHours()
})

// AIDEV-NOTE: Calendar event handlers
const handleMonthChange = (year: number, month: number) => {
  calendarYear.value = year
  calendarMonth.value = month
}

const handleViewModeChange = (mode: 'month' | 'week') => {
  calendarViewMode.value = mode
}

// Set page meta
useHead({
  title: '営業時間設定 - SDCHI Open'
})
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">営業時間設定</h1>
          <p class="mt-1 text-sm text-gray-500">
            週間営業時間を設定し、カレンダーでプレビューできます
          </p>
        </div>

        <!-- Template management -->
        <div class="flex items-center gap-3">
          <select v-if="availableTemplates.length > 0"
            @change="loadTemplate(availableTemplates.find(t => t.id === ($event.target as HTMLSelectElement).value)!)"
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">テンプレートを選択</option>
            <option v-for="template in availableTemplates" :key="template.id" :value="template.id"
              :selected="template.id === selectedTemplateId">
              {{ template.name }}
              <span v-if="template.isDefault">(デフォルト)</span>
            </option>
          </select>

          <button @click="createNewTemplate" type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            新規作成
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span class="ml-3 text-gray-600">読み込み中...</span>
    </div>

    <!-- Main content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left column: Business hours editor -->
      <div class="space-y-6">
        <!-- Template name -->
        <div>
          <label for="template-name" class="block text-sm font-medium text-gray-700 mb-2">
            テンプレート名
          </label>
          <input id="template-name" v-model="templateName" type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="営業時間テンプレート名を入力" />
        </div>

        <!-- Weekly schedule form -->
        <WeeklyScheduleForm v-model="currentTemplate" />

        <!-- Save button -->
        <div class="flex items-center justify-between pt-4">
          <div>
            <span v-if="hasUnsavedChanges" class="text-sm text-amber-600">
              未保存の変更があります
            </span>
          </div>
          <button @click="saveBusinessHours" :disabled="isSaving || !templateName.trim()" type="button"
            class="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span v-if="isSaving">保存中...</span>
            <span v-else>保存</span>
          </button>
        </div>
      </div>

      <!-- Right column: Calendar preview -->
      <div>
        <BusinessHoursCalendar :weekly-template="currentTemplate" :selected-year="calendarYear"
          :selected-month="calendarMonth" :view-mode="calendarViewMode" @month-changed="handleMonthChange"
          @view-mode-changed="handleViewModeChange" />
      </div>
    </div>

    <!-- Success/Error message -->
    <div v-if="message" :class="[
      message.type === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-red-50 border-red-200 text-red-800',
      'fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border shadow-lg z-50'
    ]">
      <div class="flex items-center">
        <svg v-if="message.type === 'success'" class="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span class="text-sm font-medium">{{ message.text }}</span>
      </div>
    </div>
  </div>
</template>