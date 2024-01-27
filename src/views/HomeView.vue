<script setup lang="ts">
import { req, type Post, postText } from '@/api'
import PostComponent from '@/components/PostComponent.vue'
import { computed, ref, type Ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const latestPostMetas: Post[] = JSON.parse(await req('/post/latest/10/0'))
const sortedLatestPosts = computed(() => {
    const latestPostsInner = [...latestPosts.value]
    latestPostsInner.sort((a, b) => {
        const aTimestamp = new Date(a[0].timestamp).getTime()
        const bTimestamp = new Date(b[0].timestamp).getTime()
        return -(aTimestamp - bTimestamp) // reverse order
    })
    return latestPostsInner
})

let latestPosts: Ref<[Post, string][]> = ref([])
latestPostMetas.map(async post => {
    try {
        const text = await postText(post.id, cookies.get('frithblog-session'))
        if (text !== null)
            latestPosts.value.push([post, text])
    }
    catch (err) {
        console.log(`error getting post ${post.id}: ${err}`)
    }
})
</script>

<template>
    <header id="title">latest posts</header>
    <hr>
    <section v-for="[post, text] in sortedLatestPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>
