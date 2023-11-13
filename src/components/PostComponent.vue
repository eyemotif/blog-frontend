<script setup lang="ts">
import { type Post, type PostID } from '@/api'
import router from '@/router'

const props = defineProps<{
    post: Post,
    text: string,
}>()


function replyQuoteString(): string {
    // this is ugly but i dont really give a shit
    const divider = `· `
    if (props.post.replies.length > 0 && props.post.quotes.length > 0) {
        return divider + `${props.post.replies.length} ${props.post.replies.length == 1 ? 'reply'
            : 'replies'}, ${props.post.quotes.length} ${props.post.quotes.length == 1 ? 'quote'
                : 'quotes'}`
    } else if (props.post.replies.length > 0) {
        return divider + `${props.post.replies.length} ${props.post.replies.length == 1 ? 'reply' : 'replies'}`
    } else if (props.post.quotes.length > 0) {
        return divider + `${props.post.quotes.length} ${props.post.quotes.length == 1 ? 'quote'
            : 'quotes'}`
    } else {
        return ''
    }
}
</script>

<template>
    <header>
        <RouterLink :to="`/user/${post.author_username}`">@{{ post.author_username }}</RouterLink>:
    </header>
    <article @click="() => $router.push(`/post/${post.id}`)" v-html="$props.text"></article>
    <footer>
        {{ (new Date(post.timestamp)).toLocaleString() }}
        {{ replyQuoteString() }}
    </footer>
</template>

<style scoped>
header {
    font-size: 1em;
}

footer {
    margin-top: 1.5em;
    font-size: 0.75em;
}

article {
    cursor: pointer;
}
</style>
