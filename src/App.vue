<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const router = useRouter()
const hasLoggedIn = computed(() => cookies.isKey('frithblog-session'))

async function startPost() {
  const sessionToken = cookies.get('frithblog-session')
  try {
    const postCreationResponse = await fetch(`http://localhost:8010/api/post/create/start?session=${sessionToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{}' // TODO: replies
    })

    if (postCreationResponse.status >= 400) {
      throw `error status ${postCreationResponse.status}`
    }

    const newPostID = await postCreationResponse.text()
    router.push(`/author/${newPostID}`)
  }
  catch (e) {
    console.error(`could not start post: ${e}`)
  }
}
</script>

<template>
  <nav id="right">
    <RouterLink v-if="!hasLoggedIn" to="login"><button>login</button></RouterLink>
    <button v-if="hasLoggedIn" @click="startPost()">create post</button>
  </nav>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<style scoped>
#right {
  float: right;
}
</style>
