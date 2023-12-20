<script setup lang="ts">
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { req, type Post } from '@/api'
import { onMounted, ref } from 'vue'

const route = useRoute()
const thread: [Post, string][] = [[
    JSON.parse(await req(`/post/${route.params.id}/meta`)),
    await req(`/post/${route.params.id}/text`)
]]

while (thread[thread.length - 1][0].reply_to !== null) {
    const newID = thread[thread.length - 1][0].reply_to

    const post = JSON.parse(await req(`/post/${newID}/meta`))
    const text = await req(`/post/${newID}/text`)

    thread.push([post, text])
}


// FIXME: quoting for thread view
// let selectionText = ref('')
// let quoteButtonText = ref('quote')
// function selectionInArticle() {
//     const selection = window.getSelection()

//     if (selection === null || selection.anchorNode === null) {
//         return false
//     }
//     let el = selection.anchorNode.parentElement
//     while (el !== null) {
//         if (el.tagName?.toLowerCase() === 'article') return true
//         el = el.parentElement
//     }
//     return false
// }
// function updateQuoteSelection() {
//     return

//     if (!selectionInArticle()) {
//         selectionText.value = ''
//         return
//     }

//     quoteButtonText.value = 'quote'
//     selectionText.value = window.getSelection()!.toString().trim()
// }
// async function copyQuoteSelection() {
//     const transformedSelection = `>~quote:${post.id}\n` + selectionText.value
//         .split('\n')
//         .map(line => `>${line}`)
//         .join('\n>\n')

//     await navigator.clipboard.writeText(transformedSelection)
//     quoteButtonText.value = 'copied!'
// }


onMounted(() => {
    if (thread.length > 1) {
        // FIXME: "TypeError: null is not an object (evaluating 'document.getElementById(`post-${s.params.id}`).parentElement')"
        document
            .getElementById(`post-${route.params.id}`)!
            .parentElement!
            .scrollIntoView({ behavior: 'smooth' })
    }
})

// TODO: make parent posts in thread clickable
</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        post</header>
    <hr>
    <section v-for="[post, text] in thread.reverse()">
        <PostComponent :post="post" :text="text" large />
        <hr>
    </section>
    <!-- <div id="quote" v-if="selectionText !== ''">
        <button @click="copyQuoteSelection()">{{ quoteButtonText }}</button>
    </div> -->
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
