<script setup lang="ts">
import type { ImageUploadOptions, PostFinishOptions } from '@/api'
import { onMounted, ref } from 'vue'
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

    const postFinishOptions: PostFinishOptions = {
        session: sessionToken,
        post_id: route.params.id as string,
        text: formData.get('text') as string
    }
    try {
        const postFinishResponse = await fetch(`/api/post/create/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postFinishOptions)
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

let imageURLs = ref<string[]>([])
let imageUploadText = ref<string | null>(null)

onMounted(() => {
    const fileInput = document.getElementById('upload')! as HTMLInputElement

    fileInput.addEventListener('change', async event => {
        fileInput.disabled = true

        const target = event.target as EventTarget & { files: FileList }

        for (let i = 0; i < target.files.length; i++) {
            imageUploadText.value = `uploading file ${i + 1}/${target.files.length}`
            const maybe_error = await uploadImage(target.files[i])

            if (maybe_error !== null) {
                console.error(`error uploading file ${i}: ${maybe_error}`)
                imageUploadText.value = 'error uploading files'
                fileInput.disabled = false
                return
            }
        }

        fileInput.disabled = false
        imageUploadText.value = null
    })
})

async function uploadImage(file: File): Promise<string | null> {

    try {
        const fileCreationOptions: ImageUploadOptions = {
            session: sessionToken,
            name: file.name
        }
        const fileCreationResponse = await fetch(`/api/post/create/image/${route.params.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileCreationOptions)
        })
        
        if (fileCreationResponse.status >= 400) {
            return `creation post request status ${fileCreationResponse.status}`
        }

        const socket = new WebSocket(`wss://blog.frith.gay/api/post/create/image/${route.params.id}/${file.name}`)
        socket.addEventListener('open',
            async () => {
                socket.send(await file.arrayBuffer())
                socket.close()
            })

        const imageURL = await fileCreationResponse.text()
        imageURLs.value.push(imageURL)

        return null

    } catch (e) {
        return `${e}`
    }
}

function insertImageMarkdown(url: string) {
    console.log('insert', url)

    const imageMarkdown = `\n![alt text](${url} "title")`
    const textInput = document.getElementById('text')! as HTMLTextAreaElement

    textInput.value += imageMarkdown
}

</script>

<template>
    <header id="title" @click="$router.push('/')">create a post</header>

    <form id="form" @submit="e => { e.preventDefault(); post() }">
        <textarea id="text" name="text"></textarea>
        <label for="upload">upload images: </label>
        <input type="file" id="upload" multiple
            accept="image/apng,image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp,">
        <input type="submit" value="post">
    </form>
    <hr>
    <div id="status">
        <p>{{ imageUploadText }}</p>
        <ul id="images" v-if="imageURLs.length > 0">
            <li v-for="url in imageURLs"><span @click="insertImageMarkdown(url)">{{ url }}</span></li>
        </ul>
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

ul {
    list-style-type: none;
}

ul.images li {
    cursor: pointer;
}
</style>
