<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const router = useRouter()

// if (cookies.isKey('frithblog-session')) {
//     router.replace('/')
// }
cookies.remove('frithblog-session')

async function submitLogin() {
    const submitButton = document.getElementById('submit')! as HTMLButtonElement
    submitButton.setAttribute('disabled', '')
    submitButton.value = 'loading...'

    const form = document.getElementById('form')! as HTMLFormElement
    const formData = new FormData(form)

    try {
        const authResponse = await fetch('/api/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'username': formData.get('username'), 'password': formData.get('password') })
        })

        if (authResponse.status >= 400) {
            throw `error: status ${authResponse.status}`
        }

        const authToken = await authResponse.text()
        cookies.set('frithblog-session', authToken)
        router.push('/')
    }
    catch (e) {
        console.error(`could not login: ${e}`)
    }
}
</script>

<template>
    <form id="form" @submit="e => { e.preventDefault(); submitLogin() }">
        <label for="username">username</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">password</label><br>
        <input type="password" id="password" name="password"><br>
        <input id="submit" type="submit" value="submit">
    </form>
    <footer>this site uses cookies to store your login session token for up to
        24 hours after you log in. that's it.</footer>
</template>

<style scoped>
input {
    margin-bottom: 0.5em;
}

footer {
    margin-top: 1em;
}
</style>
