<script setup lang="ts">
import { type Post, type PostID } from '@/api'
import router from '@/router'
import { onMounted } from 'vue'

const props = defineProps<{
    post: Post,
    text: string,
    large?: boolean,
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


onMounted(() => {
    if (props.large === true) {
        // HACK: replace all img tags with link + images when on a post page. do
        // better, me!

    }

    for (const imgTag of document.querySelectorAll('article img')) {
        const img = imgTag as HTMLImageElement
        img.loading = 'lazy'

        if (props.large === true) {
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
    <header>
        <RouterLink :to="`/user/${post.author_username}`">@{{ post.author_username }}</RouterLink>:
    </header>
    <article :class="getClass()" @click="() => goToPost(post.id)" v-html="$props.text">
    </article>
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

.small article {
    cursor: pointer;
}
</style>
