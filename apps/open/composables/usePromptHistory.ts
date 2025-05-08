type PromptHistoryItem = {
  prompt: string
  response: string
  rating?: number
}

export const usePromptHistory = () => {
  const history = useState<PromptHistoryItem[]>('prompt-history', () => [])

  const addToHistory = (item: Omit<PromptHistoryItem, 'rating'>) => {
    history.value = [...history.value, { ...item, rating: undefined }]
  }

  const updateRating = (index: number, rating: number) => {
    if (index >= 0 && index < history.value.length) {
      const newHistory = [...history.value]
      newHistory[index] = { ...newHistory[index], rating }
      history.value = newHistory
    }
  }

  return {
    history: readonly(history),
    addToHistory,
    updateRating,
    clearHistory: () => { history.value = [] }
  }
}
