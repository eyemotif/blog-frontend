<script setup lang="ts">
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { req, type Post } from '@/api'
import { ref } from 'vue'

const route = useRoute()
const post: Post = JSON.parse(await req(`/post/meta/${route.params.id}`))
const text = await req(`/post/text/${route.params.id}`)

let selectionText = ref('')
let quoteButtonText = ref('quote')
function selectionInArticle() {
    const selection = window.getSelection()

    if (selection === null || selection.anchorNode === null) {
        return false
    }
    let el = selection.anchorNode.parentElement
    while (el !== null) {
        if (el.tagName?.toLowerCase() === 'article') return true
        el = el.parentElement
    }
    return false
}
function updateQuoteSelection() {
    if (!selectionInArticle()) {
        selectionText.value = ''
        return
    }

    quoteButtonText.value = 'quote'
    selectionText.value = window.getSelection()!.toString().trim()
}
async function copyQuoteSelection() {
    const transformedSelection = `>~quote:${post.id}\n` + selectionText.value
        .split('\n')
        .map(line => `>${line}`)
        .join('\n>\n')

    await navigator.clipboard.writeText(transformedSelection)
    quoteButtonText.value = 'copied!'
}

</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        post</header>
    <hr>
    <div @click="updateQuoteSelection()">
        <PostComponent :post="post" :text="text" large />
    </div>
    <div id="quote" v-if="selectionText !== ''">
        <button @click="copyQuoteSelection()">{{ quoteButtonText }}</button>
    </div>
</template>

<style>
#title {
    cursor: pointer;
}

#quote {
    position: absolute;
    bottom: 1em;
    right: 1em;
}
</style>
