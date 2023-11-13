<script setup lang="ts">
import { type Post } from '@/api'

defineProps<{
    post: Post,
    text: string,
}>()

</script>

<template>
    <header>{{ post.author_username }} at {{ (new Date(post.timestamp)).toLocaleString() }}:</header>
    <article v-html="$props.text"></article>
    <footer>{{ post.replies.length }} {{ post.replies.length == 1 ? 'reply'
        : 'replies' }}, {{ post.quotes.length }} {{ post.quotes.length == 1 ?
        'quote' : 'quotes' }}</footer>
</template>

<style scoped>
header {
    font-size: small
}

/* article {} */

footer {
    font-size: smaller
}
</style>
