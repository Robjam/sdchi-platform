<script setup lang="ts">
import { ref } from 'vue'

const promptText = ref('')
const isLoading = ref(false)
const error = ref('')
const { history, addToHistory } = usePromptHistory()

const emit = defineEmits<{
  update: [value: string]
}>()

const submitPrompt = async () => {
  if (!promptText.value.trim()) return

  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/calendar/draft', {
      method: 'POST',
      body: {
        prompt: promptText.value,
        conversationHistory: history.value.map(item => ({
          role: 'user' as const,
          content: item.prompt
        }))
      }
    })
    emit('update', response.response)
    addToHistory({
      ...response,
      prompt: promptText.value,
      response: response.response,

    })
    promptText.value = ''
  } catch (err) {
    console.log('Error:', err)
    error.value = err.data?.message || 'ドラフトの生成に失敗しました'
    if (err.data?.fieldErrors?.prompt) {
      error.value = err.data.fieldErrors.prompt.join(', ')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <textarea
        class="w-full h-32 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        placeholder="プロンプトを入力してください..." v-model="promptText" :disabled="isLoading"></textarea>

      <button
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        @click="submitPrompt" :disabled="isLoading || !promptText.trim()">
        {{ isLoading ? '生成中...' : '送信' }}
      </button>
    </div>

    <div v-if="error" class="text-red-500 p-2 bg-red-50 rounded">
      {{ error }}
    </div>
  </div>
</template>
