<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 via-white to-secondary-100 text-neutral-900">
    <NuxtRouteAnnouncer />

    <!-- Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1
          class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500 bg-clip-text text-transparent">
          SDCHI
        </h1>
        <p class="text-xl md:text-2xl text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          The future of Japanese technology innovation starts here. Join our exclusive community of forward-thinking
          developers, entrepreneurs, and technologists.
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-neutral-700 mb-12">
          <span class="bg-primary-100 px-3 py-1 rounded-full border border-primary-200">🚀 Early Access</span>
          <span class="bg-secondary-100 px-3 py-1 rounded-full border border-secondary-200">💡 Innovation Hub</span>
          <span class="bg-accent-100 px-3 py-1 rounded-full border border-accent-200">🤝 Community Driven</span>
        </div>
      </div>

      <!-- Signup Form -->
      <div class="max-w-md mx-auto">
        <div class="bg-white backdrop-blur-sm p-8 rounded-2xl border border-primary-200 shadow-xl">
          <h2 class="text-2xl font-semibold mb-6 text-center text-primary-900">Get Early Access</h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name Field (Optional) -->
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-700 mb-2">
                Name (Optional)
              </label>
              <input id="name" v-model="form.name" type="text" :disabled="loading"
                class="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-500"
                placeholder="Your name" />
            </div>

            <!-- Email Field (Required) -->
            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <input id="email" v-model="form.email" type="email" required :disabled="loading"
                class="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-500"
                placeholder="your@email.com" />
            </div>

            <!-- Hidden Canary Field for Bot Detection -->
            <input v-model="form.canary" type="text" tabindex="-1" autocomplete="off"
              class="absolute -left-9999px opacity-0 pointer-events-none" aria-hidden="true" />

            <!-- Submit Button -->
            <button type="submit" :disabled="loading || !form.email"
              class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-neutral-400 disabled:to-neutral-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg">
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Joining...
              </span>
              <span v-else>Join the Future</span>
            </button>
          </form>

          <!-- Messages -->
          <div v-if="message.text" class="mt-4 p-3 rounded-lg"
            :class="message.type === 'success' ? 'bg-primary-100 text-primary-800 border border-primary-300' : 'bg-red-50 text-red-700 border border-red-300'">
            {{ message.text }}
          </div>
        </div>

        <!-- Additional Info -->
        <div class="text-center mt-8 text-neutral-600 text-sm">
          <p>Join thousands of innovators already on the waitlist.</p>
          <p class="mt-2">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  email: '',
  canary: ''
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

const resetForm = () => {
  form.value.name = ''
  form.value.email = ''
  form.value.canary = ''
}

const handleSubmit = async () => {
  if (!form.value.email) return

  loading.value = true
  message.value = { text: '', type: '' }

  try {
    const response = await $fetch('/api/signup', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        canary: form.value.canary
      }
    })

    message.value = {
      text: 'Welcome aboard! Check your email for what\'s next.',
      type: 'success'
    }
    resetForm()
  } catch (error) {
    console.error('Signup error:', error)
    message.value = {
      text: error.data?.message || 'Something went wrong. Please try again.',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'SDCHI.JP - The Future of Japanese Technology Innovation',
  meta: [
    { name: 'description', content: 'Join our exclusive community of forward-thinking developers, entrepreneurs, and technologists in Japan.' },
    { property: 'og:title', content: 'SDCHI.JP - The Future of Japanese Technology Innovation' },
    { property: 'og:description', content: 'Join our exclusive community of forward-thinking developers, entrepreneurs, and technologists in Japan.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>
