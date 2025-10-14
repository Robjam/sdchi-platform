<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900">
    <NuxtRouteAnnouncer />

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 -left-40 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 right-1/3 w-64 h-64 bg-accent-200/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative container mx-auto px-4 py-20 md:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Logo/Brand -->
          <div class="mb-8">
            <h1 class="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500 bg-clip-text text-transparent">
              SDCHI
            </h1>
            <p class="text-lg md:text-xl text-neutral-600 font-medium">
              飲食店経営者のための、デジタルツールボックス
            </p>
          </div>

          <!-- Main Headline -->
          <h2 class="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            お店のこと、もっと自由に。<br class="hidden md:block">
            <span class="text-primary-700">便利なツール</span>で、<br class="md:hidden">毎日を軽やかに。
          </h2>

          <p class="text-lg md:text-xl text-neutral-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            営業時間の管理、予約の受付、お客様とのコミュニケーション。<br>
            オーナー様が本当に大切にしたいことに時間を使えるよう、<br class="hidden md:block">
            私たちがサポートいたします。
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#waitlist"
              class="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg">
              ウェイトリストに登録する
            </a>
            <a href="#services"
              class="px-8 py-4 bg-white hover:bg-neutral-50 text-primary-700 font-semibold rounded-xl border-2 border-primary-300 hover:border-primary-400 transition-all text-lg">
              サービスを見る
            </a>
          </div>

          <!-- Beta Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 border border-accent-300 rounded-full text-accent-800 font-medium">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            ベータ期間中、完全無料でご利用いただけます
          </div>
        </div>
      </div>
    </section>

    <!-- Value Props Banner -->
    <section class="py-12 bg-white border-y border-neutral-200">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">厳選されたサービス</h3>
            <p class="text-neutral-600">必要なツールを、必要なときに</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">すぐに始められる</h3>
            <p class="text-neutral-600">複雑な設定は不要、登録後すぐ利用可能</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">ベータ期間中は無料</h3>
            <p class="text-neutral-600">使用制限はありますが、費用はかかりません</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cafe & Restaurant Segments -->
    <section id="services" class="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            あなたのお店に合わせた<span class="text-primary-600">サービス</span>
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            カフェもレストランも。業態に合わせて、<br class="hidden md:block">
            最適なツールをご提案します。
          </p>
        </div>

        <!-- Mobile Tabs -->
        <div class="lg:hidden max-w-2xl mx-auto mb-8">
          <div class="flex gap-2 bg-neutral-100 p-1 rounded-xl">
            <button
              @click="activeSegment = 'cafe'"
              :class="activeSegment === 'cafe'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'"
              class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              カフェ
            </button>
            <button
              @click="activeSegment = 'restaurant'"
              :class="activeSegment === 'restaurant'
                ? 'bg-white text-secondary-700 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'"
              class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              レストラン
            </button>
          </div>
        </div>

        <!-- Desktop: Two Columns / Mobile: Tabbed Content -->
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Cafe Column -->
            <div :class="activeSegment === 'cafe' ? 'block' : 'hidden lg:block'" class="space-y-6">
              <!-- Cafe Header (Desktop only) -->
              <div class="hidden lg:block text-center pb-6 border-b-2 border-primary-300">
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-neutral-900 mb-2">カフェ向け</h3>
                <p class="text-neutral-600">コーヒーと温かい時間を大切に</p>
              </div>

              <!-- Cafe Content -->
              <div class="bg-white rounded-2xl border-2 border-primary-200 p-6 md:p-8">
                <h4 class="text-xl font-bold text-neutral-900 mb-4">こんなお悩みを解決</h4>
                <ul class="space-y-3 mb-6">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">毎月の営業時間カレンダー作成が面倒</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">SNSでの営業情報更新を忘れがち</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">常連さんとの関係を大切にしたい</span>
                  </li>
                </ul>

                <div class="border-t border-neutral-200 pt-6">
                  <h4 class="text-lg font-bold text-neutral-900 mb-4">おすすめサービス</h4>
                  <div class="space-y-3">
                    <a
                      v-for="service in availableServices.filter(s => s.slug === 'open')"
                      :key="service.id"
                      :href="`/solutions/${service.slug}-cafe`"
                      class="group flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-white rounded-xl hover:shadow-md transition-all border border-primary-100 hover:border-primary-300"
                    >
                      <img :src="service.logo" :alt="service.name" class="h-10 w-auto flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <div class="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {{ service.name }}
                        </div>
                        <div class="text-sm text-neutral-600">{{ service.tagline }}</div>
                      </div>
                      <svg class="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Restaurant Column -->
            <div :class="activeSegment === 'restaurant' ? 'block' : 'hidden lg:block'" class="space-y-6">
              <!-- Restaurant Header (Desktop only) -->
              <div class="hidden lg:block text-center pb-6 border-b-2 border-secondary-300">
                <div class="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-neutral-900 mb-2">レストラン向け</h3>
                <p class="text-neutral-600">予約とおもてなしをスムーズに</p>
              </div>

              <!-- Restaurant Content -->
              <div class="bg-white rounded-2xl border-2 border-secondary-200 p-6 md:p-8">
                <h4 class="text-xl font-bold text-neutral-900 mb-4">こんなお悩みを解決</h4>
                <ul class="space-y-3 mb-6">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">電話予約の管理が煩雑</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">ダブルブッキングを防ぎたい</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-neutral-700">ノーショーで困っている</span>
                  </li>
                </ul>

                <div class="border-t border-neutral-200 pt-6">
                  <h4 class="text-lg font-bold text-neutral-900 mb-4">おすすめサービス</h4>
                  <div class="space-y-3">
                    <a
                      v-for="service in availableServices.filter(s => s.slug === 'reserve')"
                      :key="service.id"
                      :href="`/solutions/${service.slug}-restaurant`"
                      class="group flex items-center gap-4 p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl hover:shadow-md transition-all border border-secondary-100 hover:border-secondary-300"
                    >
                      <img :src="service.logo" :alt="service.name" class="h-10 w-auto flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <div class="font-bold text-neutral-900 group-hover:text-secondary-600 transition-colors">
                          {{ service.name }}
                        </div>
                        <div class="text-sm text-neutral-600">{{ service.tagline }}</div>
                      </div>
                      <svg class="w-5 h-5 text-secondary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="text-center mt-12">
          <p class="text-neutral-600 mb-4">現在3つのサービスをウェイトリスト受付中</p>
          <div class="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 rounded-full text-neutral-700 font-medium">
            <svg class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            さらに多くのサービスを準備中
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            シンプルな<span class="text-secondary-600">3つのステップ</span>
          </h2>
          <p class="text-lg text-neutral-600">
            難しい設定は必要ありません。今すぐ始められます。
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <!-- Step 1 -->
            <div class="relative text-center">
              <div class="mb-6">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 class="text-xl font-bold text-neutral-900 mb-3">アカウント登録</h3>
              <p class="text-neutral-600">
                メールアドレスだけで、簡単に登録できます。<br>
                登録後すぐにご利用開始いただけます。
              </p>
              <!-- Arrow -->
              <div class="hidden md:block absolute top-10 -right-4 text-primary-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="relative text-center">
              <div class="mb-6">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 class="text-xl font-bold text-neutral-900 mb-3">サービスを選ぶ</h3>
              <p class="text-neutral-600">
                複数のサービスから、<br>
                お店に必要なものだけを選んで利用できます。
              </p>
              <!-- Arrow -->
              <div class="hidden md:block absolute top-10 -right-4 text-secondary-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="text-center">
              <div class="mb-6">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 class="text-xl font-bold text-neutral-900 mb-3">今日から使う</h3>
              <p class="text-neutral-600">
                設定はシンプル。<br>
                その日から、お店の運営をサポートします。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left: Content -->
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                小さなお店のための、<br>
                <span class="text-primary-600">大きなサポート</span>
              </h2>
              <p class="text-lg text-neutral-700 mb-8">
                大手チェーン店のような高価なシステムは必要ありません。<br>
                個人経営のカフェやレストランにこそ、使いやすく、<br>
                本当に役立つツールが必要だと私たちは考えています。
              </p>

              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 mb-1">専門知識は不要</h3>
                    <p class="text-neutral-600">ITの知識がなくても、直感的に使えるシンプルな設計です。</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 mb-1">日本語で完全サポート</h3>
                    <p class="text-neutral-600">困ったときも安心。日本語でしっかりサポートいたします。</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 mb-1">小規模ビジネスに最適</h3>
                    <p class="text-neutral-600">オーナー様が一人で運営されているお店にも、ちょうど良いサイズ感です。</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Image Placeholder -->
            <div class="relative">
              <div class="aspect-square bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl shadow-2xl flex items-center justify-center">
                <div class="text-center p-8">
                  <svg class="w-32 h-32 mx-auto mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p class="text-white text-lg font-medium">あなたのお店の写真が<br>ここに入ります</p>
                </div>
              </div>
              <!-- Decorative elements -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-accent-300 rounded-full opacity-50 blur-2xl"></div>
              <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-300 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Waitlist CTA -->
    <section id="waitlist" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              プライベートベータへの<br class="md:hidden">
              <span class="text-primary-600">ご参加をお待ちしています</span>
            </h2>
            <p class="text-lg text-neutral-600">
              ベータ期間中は完全無料。<br>
              お店の運営を、もっと自由に、もっと軽やかに。
            </p>
          </div>

          <div class="bg-gradient-to-br from-primary-50 to-secondary-50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border-2 border-primary-200 shadow-xl">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Name Field -->
              <div>
                <label for="name" class="block text-sm font-semibold text-neutral-800 mb-2">
                  お名前（任意）
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :disabled="loading"
                  class="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-400 disabled:bg-neutral-100"
                  placeholder="山田太郎"
                />
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-semibold text-neutral-800 mb-2">
                  メールアドレス <span class="text-error">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 placeholder-neutral-400 disabled:bg-neutral-100"
                  placeholder="your@email.com"
                />
              </div>

              <!-- Hidden Canary -->
              <input
                v-model="form.canary"
                type="text"
                tabindex="-1"
                autocomplete="off"
                class="absolute -left-9999px opacity-0 pointer-events-none"
                aria-hidden="true"
              />

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading || !form.email"
                class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl text-lg"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登録中...
                </span>
                <span v-else>ウェイトリストに登録する</span>
              </button>
            </form>

            <!-- Messages -->
            <div
              v-if="message.text"
              class="mt-5 p-4 rounded-xl"
              :class="message.type === 'success'
                ? 'bg-primary-100 text-primary-900 border-2 border-primary-300'
                : 'bg-red-50 text-red-800 border-2 border-red-300'"
            >
              {{ message.text }}
            </div>

            <!-- Fine Print -->
            <div class="text-center mt-6 text-neutral-600 text-sm">
              <p>登録いただいたメールアドレスは、SDCHI からの連絡にのみ使用します。</p>
              <p class="mt-1">スパムメールは送りません。いつでも配信停止できます。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Footer -->
    <section class="py-12 bg-neutral-900 text-neutral-300">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div class="text-3xl font-bold text-white mb-2">3+</div>
              <div class="text-sm">ウェイトリスト受付中</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white mb-2">0円</div>
              <div class="text-sm">ベータ期間中の利用料金</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-white mb-2">24/7</div>
              <div class="text-sm">システム稼働時間</div>
            </div>
          </div>
          <p class="text-sm text-neutral-400">
            安心してご利用いただけるよう、セキュリティとプライバシーを最優先に考えています。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Get available services
const { getActiveServices } = await useServices()
const availableServices = getActiveServices()

// Segment tab state (for mobile)
const activeSegment = ref('cafe')

// Form handling
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
    await $fetch('/api/signup', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        canary: form.value.canary
      }
    })

    message.value = {
      text: 'ご登録ありがとうございます！メールをご確認ください。',
      type: 'success'
    }
    resetForm()
  } catch (error) {
    console.error('Signup error:', error)
    message.value = {
      text: error.data?.message || '登録に失敗しました。もう一度お試しください。',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'SDCHI - 飲食店経営者のための、デジタルツールボックス',
  meta: [
    { name: 'description', content: '営業時間管理、予約受付、お客様とのコミュニケーション。便利なツールで、小さなお店の毎日をサポート。ベータ期間中は完全無料。' },
    { property: 'og:title', content: 'SDCHI - 飲食店経営者のための、デジタルツールボックス' },
    { property: 'og:description', content: '営業時間管理、予約受付、お客様とのコミュニケーション。便利なツールで、小さなお店の毎日をサポート。' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>
