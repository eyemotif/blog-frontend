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
export async function postText(postId: PostID, session?: string): Promise<string> {
    if (session === undefined || session.trim().length == 0) {
        return await req(`/post/${postId}/text`)
    } else {

        const postCreationResponse = await fetch(`/api/post/${postId}/text/member`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session })
        })
        return await postCreationResponse.text()
    }
}
