<script setup lang="ts">
import { req, type Post } from '@/api'
import PostComponent from '@/components/PostComponent.vue'

const latestPostMetas: Post[] = JSON.parse(await req('/post/latest/10/0'))
let latestPosts: [Post, string][] = []

for (const post of latestPostMetas) {
    try {
        const text = await req(`/post/text/${post.id}`)
        latestPosts.push([post, text])
    }
    catch (err) {
        console.log(`error getting post ${post.id}: ${err}`)
    }
}
</script>

<template>
    <title>latest posts</title>
    <hr>
    <section v-for="[post, text] in latestPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>
