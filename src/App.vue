<script setup lang="ts">
import { computed, onMounted, type ComputedRef } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import type { PostID, PostCreationOptions } from './api'

type ButtonState = 'login' | 'create' | 'reply' | 'hide'

const { cookies } = useCookies()
const router = useRouter()

async function startPost(replyTo?: PostID) {
  const sessionToken = cookies.get('frithblog-session')
  try {
    const postCreationOptions: PostCreationOptions = {
      session: sessionToken,
      reply_to: replyTo
    }


    const postCreationResponse = await fetch(`/api/post/create/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postCreationOptions)
    })

    if (postCreationResponse.status >= 400) {
      if (postCreationResponse.status === 401) {
        cookies.remove('frithblog-session')
        window.location.reload()
      } else {
        throw `error status ${postCreationResponse.status} ${postCreationResponse.statusText}`
      }
    }

    const newPostID = await postCreationResponse.text()
    router.push(`/author/${newPostID}`)
  }
  catch (e) {
    console.error(`could not start post: ${e}`)
  }
}

function getButtonState(): ButtonState {
  const path = router.currentRoute.value.path

  if (path.startsWith('/author') || path.startsWith('/login')) {
    return 'hide'
  } else if (cookies.isKey('frithblog-session')) {
    return path.startsWith('/post') ? 'reply' : 'create'
  } else {
    return 'login'
  }
}

</script>

<template>
  <nav id="right">
    <RouterLink v-if="getButtonState() === 'login'" to="login"><button>login</button></RouterLink>
    <button v-if="getButtonState() === 'create'" @click="startPost()">create post</button>
    <button v-if="getButtonState() === 'reply'" @click="startPost($route.params.id as string)">
      reply
    </button>
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
