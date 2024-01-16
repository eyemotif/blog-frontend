<script setup lang="ts">
import { req, type Post, postText } from '@/api'
import PostComponent from '@/components/PostComponent.vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const latestPostMetas: Post[] = JSON.parse(await req('/post/latest/10/0'))
let latestPosts: [Post, string][] = []

for (const post of latestPostMetas) {
    try {

        const text = await postText(post.id, cookies.get('frithblog-session'))
        latestPosts.push([post, text])
    }
    catch (err) {
        console.log(`error getting post ${post.id}: ${err}`)
    }
}
</script>

<template>
    <header id="title">latest posts</header>
    <hr>
    <section v-for="[post, text] in latestPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>
