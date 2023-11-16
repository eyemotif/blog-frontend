<script setup lang="ts">
import { ref } from 'vue'
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

const fileInput = document.getElementById('upload')! as HTMLInputElement
let imageURLs = ref<string[]>([])

fileInput.addEventListener('change', async event => {
    fileInput.disabled = true

    const target = event.target as EventTarget & { files: FileList }

    for (let i = 0; i < target.files.length; i++) {
        fileInput.value = `uploading file ${i + 1}/${target.files.length}`
        const maybe_error = await uploadImage(target.files[i])

        if (maybe_error !== null) {
            console.error(`error uploadin file ${i}: ${maybe_error}`)
            break
        }
    }

    fileInput.disabled = false
    fileInput.value = 'error uploading files'
})

async function uploadImage(file: File): Promise<string | null> {
    const fileUploadURL = `/api/post/create/image/${route.params.id}/${file.name}`

    try {
        const fileCreationResponse = await fetch(fileUploadURL, {
            method: 'POST'
        })
        if (fileCreationResponse.status >= 400) {
            return `creation post request status ${fileCreationResponse.status}`
        }

        const socket = new WebSocket(`wss://blog.frith.gay${fileUploadURL}`)
        socket.send(await file.arrayBuffer())

        const imageURL = await fileCreationResponse.text()
        imageURLs.value.push(imageURL)

        return null

    } catch (e) {
        return `${e}`
    }
}

function insertImageMarkdown(url: string) {
    const imageMarkdown = `[alt text](${url} "title")`
    const textInput = document.getElementById('text')! as HTMLTextAreaElement

    if (textInput.textContent === null) {
        textInput.textContent = imageMarkdown
    } else {
        textInput.textContent += imageMarkdown
    }
}

</script>

<template>
    <header id="title" @click="$router.push('/')">create a post</header>

    <form id="form" @submit="e => { e.preventDefault(); post() }">
        <textarea id="text" name="text"></textarea>
        <input type="file" id="upload" value="upload images" multiple>
        <input type="submit" value="post">
    </form>
    <div id="images" v-if="imageURLs.length > 0">
        <hr>
        <span v-for="url in imageURLs" @click="insertImageMarkdown(url)">{{ url }}</span>
    </div>
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
