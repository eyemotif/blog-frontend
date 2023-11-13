<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const hasLoggedIn = computed(() => cookies.isKey('frithblog-session'))
</script>

<template>
  <a v-if="!hasLoggedIn" href="/login"><button>login</button></a>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>
