<script setup lang="ts">
import SandboxClient from '~/components/sandbox.client.vue';

definePageMeta({
  layout: 'sidebar',
})

const defaultCode = `
type DateString = string;
type CalendarProps = {
  operatingHours: Record<DateString, { 
    morning?: { start: DateString; end: DateString } | null;
    afternoon?: { start: DateString; end: DateString } | null;
  }>;
}

function App({operatingHours}: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Object.entries(operatingHours).map(([date, hours]) => (
        <div key={date} className="p-4 border rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">{date}</h3>
          <div className="flex space-x-2">
            {/* 午前 */}
            <div className="relative w-12 h-12">
              {hours.morning ? (
                <>
                  <div className="absolute inset-0 bg-green-100 rounded-full clip-half-left"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">午前</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-red-100 rounded-full clip-half-left"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">午前</span>
                  </div>
                </>
              )}
            </div>
            
            {/* 午後 */}
            <div className="relative w-12 h-12">
              {hours.afternoon ? (
                <>
                  <div className="absolute inset-0 bg-green-100 rounded-full clip-half-right"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">午後</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-red-100 rounded-full clip-half-right"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">午後</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-center">
            {hours.morning && (
              <p>
                {new Date(hours.morning.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(hours.morning.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            {hours.afternoon && (
              <p>
                {new Date(hours.afternoon.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(hours.afternoon.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
};
`;

const { history, updateRating } = usePromptHistory()
const code = ref(defaultCode);

const handleHistorySelect = (response: string) => {
  code.value = response
}

</script>

<template>
  <div>
    <h1>カレンダー詳細</h1>
    <SandboxClient :code="code" />
    <Prompt @update="handleHistorySelect" />
  </div>
</template>
