type TimeSlot = {
  start: string;
  end: string;
}

// AIDEV-NOTE: Generic operating hours type supporting multiple time periods per day
type OperatingHours = {
  periods: TimeSlot[];
} | null

// AIDEV-NOTE: Weekly template maps day of week (0=Sunday, 1=Monday, etc.) to operating hours. this 
type WeeklyTemplate = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, OperatingHours>

type CalendarDatesOptions = {
  weeklyTemplate?: WeeklyTemplate;
}
export const useCalendarDates = (initialOptions?: CalendarDatesOptions) => {
  const selectedYear = ref(new Date().getFullYear())
  const selectedMonth = ref(new Date().getMonth() + 1) // 1-based month
  const weeklyTemplate = ref<WeeklyTemplate | undefined>(initialOptions?.weeklyTemplate)

  // AIDEV-NOTE: Generate all days in selected month, applying weekly template if provided
  const generateDatesForMonth = (year: number, month: number, template?: WeeklyTemplate): Record<string, OperatingHours> => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const dates: Record<string, OperatingHours> = {}

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const date = new Date(year, month - 1, day) // month is 0-based in Date constructor
      const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6

      // Apply template if provided, otherwise default to null
      dates[dateString] = template?.[dayOfWeek] ?? null
    }

    return dates
  }

  const operatingHours = computed(() =>
    generateDatesForMonth(selectedYear.value, selectedMonth.value, weeklyTemplate.value)
  )

  const setSelectedMonth = (year: number, month: number) => {
    selectedYear.value = year
    selectedMonth.value = month
  }

  const setWeeklyTemplate = (template: WeeklyTemplate) => {
    weeklyTemplate.value = template
  }

  return {
    selectedYear: readonly(selectedYear),
    selectedMonth: readonly(selectedMonth),
    weeklyTemplate: readonly(weeklyTemplate),
    operatingHours,
    setSelectedMonth,
    setWeeklyTemplate,
    generateDatesForMonth
  }
}