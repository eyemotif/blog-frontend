<script setup lang="ts">
import { req, type Post, type User, postText, } from '@/api'
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { useCookies } from 'vue3-cookies'
import { computed, ref, type Ref } from 'vue'

const route = useRoute()
const { cookies } = useCookies()
const user: User = JSON.parse(await req(`/user/${route.params.username}`))
const sortedUserPosts = computed(() => {
    const userPostsInner = [...userPosts.value]
    userPostsInner.sort((a, b) => {
        const aTimestamp = new Date(a[0].timestamp).getTime()
        const bTimestamp = new Date(b[0].timestamp).getTime()
        return -(aTimestamp - bTimestamp) // reverse order
    })
    return userPostsInner
})

let userPosts: Ref<[Post, string][]> = ref([])
user.posts.reverse().map(async postID => {
    try {
        const meta: Post = JSON.parse(await req(`/post/${postID}/meta`))
        const text = await postText(postID, cookies.get('frithblog-session'))

        if (text !== null)
            userPosts.value.push([meta, text])
    }
    catch (err) {
        console.log(`error getting post ${postID}: ${err}`)
    }
})

</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        {{ user.name }}'s posts</header>
    <hr>
    <section v-for="[post, text] in sortedUserPosts">
        <PostComponent :post="post" :text="text" />
        <hr>
    </section>
</template>

<style scoped>
#title {
    cursor: pointer;
}
</style>
