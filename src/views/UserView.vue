<script setup lang="ts">
import { req, type Post, type User, } from '@/api'
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'

const route = useRoute()
const user: User = JSON.parse(await req(`/user/${route.params.username}`))

let userPosts: [Post, string][] = []

for (const postID of user.posts) {
    try {
        const meta: Post = JSON.parse(await req(`/post/meta/${postID}`))
        const text = await req(`/post/text/${postID}`)

        userPosts.push([meta, text])
    }
    catch (err) {
        console.log(`error getting post ${postID}: ${err}`)
    }
}

</script>

<template>
    <title @click="() => $router.push('/')">
        {{ user.name }}'s posts</title>
    <hr>
    <section v-for="[post, text] in userPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>

<style scoped>
title {
    cursor: pointer;
}
</style>
