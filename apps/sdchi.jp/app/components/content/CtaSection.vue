<template>
  <div class="not-prose bg-white px-4 md:px-6 py-4 rounded-lg md:rounded-2xl border border-primary-200 shadow-sm md:shadow-md">
    <!-- Already Signed Up State -->
    <div v-if="isAlreadySignedUp" class="text-center">
      <div
        class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-lg font-semibold mb-2 text-primary-900 leading-tight">{{ savedData.name || 'お客様' }}、お帰りなさいませ</h2>
      <p class="text-base text-neutral-700 mb-2 leading-relaxed">{{ signupConfig.alreadySignedUpText }}</p>
      <p class="text-sm text-neutral-600 leading-normal">{{ savedData.company }} • {{ savedData.email }}</p>
      <button @click="resetSignup" class="text-primary-600 hover:text-primary-700 underline text-sm mt-3">
        別のメールアドレスで登録する
      </button>
    </div>

    <!-- Signup Form State -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 items-start py-4">
      <!-- Left Column: Marketing Copy -->
      <div>

        <h2 class="text-xl mb-4 font-bold leading-tight bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {{ signupConfig.headline }}
        </h2>
        <p class="text-base text-neutral-700 mb-6 leading-relaxed">
          <slot>{{ signupConfig.description }}</slot>
        </p>

        <!-- Trust Indicators (Desktop Only) -->
        <div class="hidden md:block space-y-3">
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"></path>
            </svg>
            <span>安全なデータ管理</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-600">
            <svg class="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>営業メールは一切送りません</span>
          </div>
        </div>

      </div>

      <!-- Right Column: Form -->
      <div>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Company Name Field -->
            <div>
              <input id="beta-company" v-model="form.company" type="text" required :disabled="loading"
                class="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-500 text-sm"
                placeholder="店舗名・会社名" />
            </div>

            <!-- Name Field -->
            <div>
              <input id="beta-name" v-model="form.name" type="text" required :disabled="loading"
                class="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-500 text-sm"
                placeholder="お名前" />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <input id="beta-email" v-model="form.email" type="email" required :disabled="loading"
              class="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-500 text-sm"
              placeholder="メールアドレス" />
          </div>

          <!-- Trust Indicators (Mobile Only) -->
          <div class="md:hidden space-y-3 pt-2">
            <div class="flex items-center gap-2 text-sm text-neutral-600">
              <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <span>安全なデータ管理</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-neutral-600">
              <svg class="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>営業メールは一切送りません</span>
            </div>
          </div>

          <!-- Hidden Canary Field for Bot Detection -->
          <input v-model="form.canary" type="text" tabindex="-1" autocomplete="off"
            class="absolute -left-9999px opacity-0 pointer-events-none" aria-hidden="true" />

          <!-- Submit Button -->
          <button type="submit" :disabled="loading || !isFormValid"
            class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-neutral-400 disabled:to-neutral-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg text-sm">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              送信中...
            </span>
            <span v-else>{{ signupConfig.buttonText }}</span>
          </button>
        </form>

        <!-- Messages -->
        <div v-if="message.text" class="mt-3 p-2 rounded-lg transition-all text-sm"
          :class="message.type === 'success' ? 'bg-primary-100 text-primary-800 border border-primary-300' : 'bg-red-50 text-red-700 border border-red-300'">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  signupType: {
    type: String,
    default: 'private-beta',
    validator: (value) => ['private-beta', 'waitlist'].includes(value)
  },
  ctaType: {
    type: String,
    default: 'waitlist',
    validator: (value) => ['waitlist', 'private-beta', 'public-beta', 'general-availability'].includes(value)
  }
})

const signupConfigs = {
  'private-beta': {
    headline: 'プライベートベータに参加',
    description: '正式リリース前に最新機能をいち早く体験できます',
    buttonText: '優先アクセスを申し込む',
    successMessage: 'プライベートベータへのご登録ありがとうございます。メールで詳細をお送りいたします。',
    alreadySignedUpText: 'プライベートベータにご登録済みです。'
  },
  'waitlist': {
    headline: '優先案内リストに登録',
    description: 'リリース時に優先的にご案内し、いち早くご利用いただけます',
    buttonText: '優先案内を受け取る',
    successMessage: 'ご登録ありがとうございます。リリース時に優先的にご案内いたします。',
    alreadySignedUpText: '優先案内リストにご登録済みです。'
  }
}

const signupConfig = computed(() => signupConfigs[props.signupType])

// Use Nuxt's useCookie composable for SSR-safe cookie handling
const COOKIE_NAME = 'sdchi-signup'
const COOKIE_EXPIRES = 30 // days

const signupCookie = useCookie(COOKIE_NAME, {
  maxAge: COOKIE_EXPIRES * 24 * 60 * 60,
  path: '/',
  sameSite: 'lax'
})

const form = ref({
  name: '',
  company: '',
  email: '',
  canary: ''
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

// Initialize state from cookie SSR-safe
const isAlreadySignedUp = ref(
  signupCookie.value?.signedUp && signupCookie.value?.signupType === props.signupType
)
const savedData = ref(signupCookie.value || {})

const isFormValid = computed(() => {
  const nameValid = form.value.name.trim().length > 0
  const companyValid = form.value.company.trim().length > 0
  const emailValid = form.value.email.trim().length > 0 && form.value.email.includes('@')

  return nameValid && companyValid && emailValid
})

const resetForm = () => {
  form.value.name = ''
  form.value.company = ''
  form.value.email = ''
  form.value.canary = ''
}

const resetSignup = () => {
  signupCookie.value = null
  isAlreadySignedUp.value = false
  savedData.value = {}
  resetForm()
  message.value = { text: '', type: '' }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  message.value = { text: '', type: '' }

  try {
    const response = await $fetch('/api/signup', {
      method: 'POST',
      body: {
        name: form.value.name,
        company: form.value.company,
        email: form.value.email,
        canary: form.value.canary,
        source: props.signupType
      }
    })

    const userData = {
      name: form.value.name,
      company: form.value.company,
      email: form.value.email,
      signedUp: true,
      signupType: props.signupType,
      signupDate: new Date().toISOString()
    }

    signupCookie.value = userData
    savedData.value = userData
    isAlreadySignedUp.value = true

    message.value = {
      text: signupConfig.value.successMessage,
      type: 'success'
    }

    resetForm()

    setTimeout(() => {
      message.value = { text: '', type: '' }
    }, 5000)

  } catch (error) {
    console.error('Beta signup error:', error)
    message.value = {
      text: error.data?.message || '問題が発生しました。もう一度お試しいただくか、サポートまでご連絡ください。',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}
</script>