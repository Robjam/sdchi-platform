<script setup lang="ts">
defineProps<{
  name: string
  id: string
  email: string
  telephone: string
  imageUrl: string
}>()
</script>

<template>
  <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm">
    <div class="flex flex-1 flex-col p-8">
      <h3 class="mb-6 text-md font-medium text-gray-900">{{ name }}</h3>
      <img class="mx-auto size-32 shrink-0 rounded-full" :src="imageUrl" :alt="name" />
    </div>
    <div>
      <div class="-mt-px flex divide-x divide-gray-200">
        <div class="flex w-0 flex-1">
          <NuxtLink :to="`calendars/new?duplicate=${id}`"
            class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            複製
          </NuxtLink>
        </div>
        <div class="-ml-px flex w-0 flex-1">
          <NuxtLink :to="`calendars/${id}`"
            class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            編集
          </NuxtLink>
        </div>
      </div>
    </div>
  </li>
</template>
