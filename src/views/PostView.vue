<script setup lang="ts">
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { req, type Post } from '@/api'

const route = useRoute()
const post: Post = JSON.parse(await req(`/post/meta/${route.params.id}`))
const text = await req(`/post/text/${route.params.id}`)

</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        post</header>
    <hr>
    <PostComponent :post="post" :text="text" large />
</template>

<style>
#title {
    cursor: pointer;
}
</style>
