<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const router = useRouter()
const route = useRoute()

if (!cookies.isKey('frithblog-session')) {
    router.replace('/')
}
const sessionToken = cookies.get('frithblog-session')

async function post() {
    const form = document.getElementById('form')! as HTMLFormElement
    const formData = new FormData(form)

    try {
        const postFinishResponse = await fetch(`/api/post/create/finish?session=${sessionToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'post_id': route.params.id, 'text': formData.get('text') })
        })

        if (postFinishResponse.status >= 400) {
            throw `error status ${postFinishResponse.status}`
        }

        router.replace('/')
    }
    catch (e) {
        console.error(`could not post: ${e}`)
    }

}

</script>

<template>
    <header id="title" @click="$router.push('/')">create a post</header>

    <form id="form" @submit="e => { e.preventDefault(); post() }">
        <textarea id="text" name="text"></textarea>
        <input type="button" value="upload image" @click="() => console.error('TODO')">
        <input type="submit" value="post">
    </form>
</template>

<style scoped>
#title {
    cursor: pointer;
}

form {
    height: 75%;
}

#text {
    width: 100%;
    height: 100%;
    font-size: 1.5em;
}

form input[type=button],
form input[type=submit] {
    margin-right: 1em;
}
</style>
