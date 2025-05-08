<script setup lang="ts">
import CalendarCard from '~/components/calendarCard.vue'

definePageMeta({
  layout: 'sidebar',
})

const people = [
  {
    name: '2025-05(1)',
    id: '3df4e5b-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
]
</script>
<template>
  <div class="mb-8 flex items-center justify-between">
    <h1 class="text-2xl font-bold text-open-900">カレンダー</h1>
    <NuxtLink to="/calendars/new"
      class="rounded-md bg-open-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-open-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-open-600">
      新規カレンダー作成
    </NuxtLink>
  </div>

  <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <CalendarCard v-for="person in people" :key="person.email" :name="person.name" :id="person.id" :title="person.title"
      :role="person.role" :email="person.email" :telephone="person.telephone" :imageUrl="person.imageUrl" />
  </ul>
</template>
