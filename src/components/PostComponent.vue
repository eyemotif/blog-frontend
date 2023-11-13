<script setup lang="ts">
import { type Post, type PostID } from '@/api'
import router from '@/router'

defineProps<{
    post: Post,
    text: string,
}>()

function navigateToPost(id: PostID) {
    router.push(`/post/${id}`)
}
</script>

<template>
    <header>
        <RouterLink :to="`/user/${post.author_username}`">@{{ post.author_username
        }}</RouterLink> at {{ (new
    Date(post.timestamp)).toLocaleString() }}:
    </header>
    <article @click="() => navigateToPost(post.id)" v-html="$props.text"></article>
    <footer>{{ post.replies.length }} {{ post.replies.length == 1 ? 'reply'
        : 'replies' }}, {{ post.quotes.length }} {{ post.quotes.length == 1 ?
        'quote' : 'quotes' }}</footer>
</template>

<style scoped>
header {
    font-size: 1em
}

article {
    font-size: 1.75em;
    cursor: pointer;
}

footer {
    font-size: 0.75em
}
</style>
