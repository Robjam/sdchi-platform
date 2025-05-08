<script setup lang="ts">
import SandboxClient from '~/components/sandbox.client.vue';

definePageMeta({
  layout: 'sidebar',
})

const defaultCode = `
type DateString = string;
type TimeSlot = {
  start: DateString;
  end: DateString;
}
type CalendarProps = {
  operatingHours: Record<DateString, {
    periods: TimeSlot[];
  } | null>;
}

function App({operatingHours}: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Object.entries(operatingHours).map(([date, hours]) => (
        <div key={date} className="p-4 border rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">{date}</h3>
          <div className="w-16 h-16 relative">
            {hours && hours.periods.length > 0 ? (
              <>
                <div className="absolute inset-0 bg-green-100 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">営業</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-red-100 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">休業</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-center">
            {hours && hours.periods.map((period, index) => (
              <p key={index}>
                {new Date(date + 'T' + period.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(date + 'T' + period.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};
`;

const { history } = usePromptHistory()
const { operatingHours, selectedYear, selectedMonth, setSelectedMonth } = useCalendarDates()
const code = ref(defaultCode);

watch(history, (newHistory) => {
  if (newHistory.length > 0) {
    const response = newHistory[newHistory.length - 1].response
    code.value = typeof response === 'string' ? response : JSON.stringify(response, null, 2)
  }
}, { immediate: true })

// AIDEV-NOTE: Year/month selection logic moved to YearMonthSelector component

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">営業表の新規作成</h1>
    
    <YearMonthSelector 
      :selected-year="selectedYear" 
      :selected-month="selectedMonth" 
      @update="setSelectedMonth" 
    />

    <PromptHistory 
      :items="history" 
      @select="(index) => {
        const response = history[index].response
        code = typeof response === 'string' ? response : JSON.stringify(response, null, 2)
      }" 
    />
    <SandboxClient :code="code" :operating-hours="operatingHours" />
    <Prompt />
  </div>
</template>
