<script setup lang="ts">
import { req, type Post, type User, postText, } from '@/api'
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { useCookies } from 'vue3-cookies'

const route = useRoute()
const { cookies } = useCookies()
const user: User = JSON.parse(await req(`/user/${route.params.username}`))

let userPosts: [Post, string][] = []

for (const postID of user.posts.reverse()) {
    try {
        const meta: Post = JSON.parse(await req(`/post/${postID}/meta`))
        const text = await postText(postID, cookies.get('frithblog-session'))

        userPosts.push([meta, text])
    }
    catch (err) {
        console.log(`error getting post ${postID}: ${err}`)
    }
}

</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        {{ user.name }}'s posts</header>
    <hr>
    <section v-for="[post, text] in userPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>

<style scoped>
#title {
    cursor: pointer;
}
</style>
