<script setup lang="ts">
import { useRoute } from 'vue-router'
import PostComponent from '@/components/PostComponent.vue'
import { req, type Post, postText } from '@/api'
import { onMounted, ref, watch, type Ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const route = useRoute()
let thread: Ref<[Post, string][]> = ref([])

watch(route, async (route) => {
    let tempThread: [Post, string][] = []

    // reverse order, includes current post
    const children: Post[] = JSON.parse(await req(`/post/thread/${route.params.id}`))
    for (const post of children) {
        const text = await postText(post.id, cookies.get('frithblog-session'))
        if (text !== null)
            tempThread.push([post, text])
    }

    while (tempThread[tempThread.length - 1][0].reply_to !== null) {
        const newID = tempThread[tempThread.length - 1][0].reply_to

        const post = JSON.parse(await req(`/post/${newID}/meta`))
        const text = await postText(post.id, cookies.get('frithblog-session'))
        if (text !== null)
            tempThread.push([post, text])
    }

    thread.value = tempThread.reverse()
}, { immediate: true })


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
    if (thread.value.length > 1) {
        // FIXME: "TypeError: null is not an object (evaluating 'document.getElementById(`post-${s.params.id}`).parentElement')"
        document
            .getElementById(`post-${route.params.id}`)!
            .parentElement!
            .scrollIntoView({ behavior: 'smooth' })
    }
})

</script>

<template>
    <header id="title" @click="() => $router.push('/')">
        post</header>
    <hr>
    <section v-for="[post, text] in thread">
        <PostComponent v-if="post.id === $route.params.id" :post="post" :text="text" large />
        <PostComponent v-else :post="post" :text="text" />
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
