<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>
