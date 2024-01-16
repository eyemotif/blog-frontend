import { useCookies } from 'vue3-cookies'

export type PostID = string
export type SessionID = string

export type User = {
    username: string,
    name: string,
    posts: PostID[]
}

export type Post = {
    id: PostID,
    author_username: string,
    timestamp: string,
    reply_to: PostID | null,
    replies: PostID[],
    quotes: PostID[],
}

export type PostCreationOptions = {
    session: SessionID,
    reply_to?: string
}
export type PostFinishOptions = {
    session: SessionID,
    post_id: PostID,
    text: String,
}
export type ImageUploadOptions = {
    session: SessionID,
    name: String,
}

export async function req(path: string): Promise<string> {
    return (await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' } })).text()
}
export async function postText(postId: PostID, session?: string): Promise<string | null> {
    if (session === undefined || session === null || session.trim().length == 0) {
        const postCreationResponse = await fetch(`/api/post/${postId}/text`)

        if (postCreationResponse.status == 403) {
            return null
        } else if (postCreationResponse.status >= 400) {
            throw `/post/text error status ${postCreationResponse.status}`
        }

        return await postCreationResponse.text()
    } else {


        const postCreationResponse = await fetch(`/api/post/${postId}/text/member`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session }),
        })

        if (postCreationResponse.status == 401) {
            console.error('stale session!')

            useCookies().cookies.remove('frithblog-session')
            document.location.reload()
        } else if (postCreationResponse.status == 403) {
            return null
        } else if (postCreationResponse.status >= 400) {
            throw `/post/text/member error status ${postCreationResponse.status}`
        }

        return await postCreationResponse.text()

    }

}
