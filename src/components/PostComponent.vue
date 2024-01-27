<script setup lang="ts">
import { req, type Post, type PostID } from '@/api'
import router from '@/router'
import { onMounted } from 'vue'

const props = defineProps<{
    post: Post,
    text: string,
    large?: boolean,
}>()

let replyUsername: string | null = null

if (props.post.reply_to !== null) {
    const parentPost: Post = JSON.parse(await req(`/post/${props.post.reply_to}/meta`))
    replyUsername = parentPost.author_username
}

function replyQuoteString(): string {
    const divider = `·`
    const replies = props.post.replies.length
    const quotes = props.post.quotes.length

    const repliesString = `${replies} ${replies == 1 ? 'reply' : 'replies'}`
    const quotesString = `${quotes} ${quotes == 1 ? 'quote' : 'quotes'}`

    if (replies > 0 && quotes > 0) {
        return `${divider} ${repliesString}, ${quotesString}`
    } else if (replies > 0) {
        return `${divider} ${repliesString}`
    } else if (quotes > 0) {
        return `${divider} ${quotesString}`
    } else {
        return ''
    }
}

function getClass(): string {
    if (props.large === true) {
        return 'large'
    } else {
        return 'small'
    }
}

function goToPost(postID: PostID) {
    if (props.large !== true) {
        router.push(`/post/${postID}`)
    }
}


onMounted(async () => {
    for (const imgTag of document.querySelectorAll('article img')) {
        const img = imgTag as HTMLImageElement
        img.loading = 'lazy'

        if (props.large === true) {
            // HACK: replace all img tags with link + images when on a post page. do
            // better, me!
            const anchor = document.createElement('a')

            anchor.href = `${img.src}?raw=true`
            img.src = `${img.src}?large=true`

            img.parentNode!.replaceChild(anchor, img)
            anchor.appendChild(img)
        }
    }
})

</script>

<template>
    <header v-if="replyUsername !== null">
        <RouterLink :to="`/user/${post.author_username}`">
            <span class="author">@{{ post.author_username }}</span>
        </RouterLink>
        <span>, replying to </span>
        <RouterLink :to="`/post/${post.reply_to}`">
            <span>@{{ replyUsername }}'s post</span>
        </RouterLink>:
    </header>
    <header v-else>
        <RouterLink :to="`/user/${post.author_username}`">
            <span class="author">@{{ post.author_username }}</span>
        </RouterLink>:
    </header>

    <article :class="getClass()" :id="`post-${post.id}`" @click="() => goToPost(post.id)" v-html="$props.text">
    </article>
    <footer>
        {{ (new Date(post.timestamp)).toLocaleString() }}
        {{ replyQuoteString() }}
        {{ post.is_private ? '· private post' : '' }}
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
</style>
